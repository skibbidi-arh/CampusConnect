import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoBackButton from '../../components/GoBackButton';
import { AuthContext } from '../../context/AuthContext';

const BASE_URL = 'http://localhost:4000/api/marketplace';

export default function MarketplaceItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { User } = AuthContext();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(null); // Track which pre-order is being verified
    const [markReadyLoading, setMarkReadyLoading] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [userPreOrder, setUserPreOrder] = useState(null);
    const [showPreOrderModal, setShowPreOrderModal] = useState(false);

    const currentUserId = User?.users_id;

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.get(`${BASE_URL}/${id}`, config);
            if (res.data.success) {
                setPost(res.data.post);
                // Check if user has a pre-order
                if (res.data.post.preOrders) {
                    const myPreOrder = res.data.post.preOrders.find(po => po.userId === currentUserId);
                    setUserPreOrder(myPreOrder);
                }
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            toast.error('Failed to load item details');
            navigate('/marketplace');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentDone = async () => {
        if (!window.confirm('Have you completed the payment for this item?')) return;
        try {
            setActionLoading(true);
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.put(`${BASE_URL}/${id}/payment-done`, {}, config);
            if (res.data.success) {
                toast.success('Payment marked as done!');
                setPost(res.data.post); // Update local state
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update payment status');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePreOrderSubmit = async (e) => {
        e.preventDefault();
        if (!transactionId.trim()) {
            toast.error('Please enter your bKash transaction ID');
            return;
        }
        try {
            setActionLoading(true);
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.post(`${BASE_URL}/${id}/pre-order`, { transactionId }, config);
            if (res.data.success) {
                toast.success('Pre-order submitted successfully! Waiting for verification.');
                fetchPost(); // Refresh to get updated data
                setTransactionId('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit pre-order');
        } finally {
            setActionLoading(false);
        }
    };

    const handleVerifyPreOrder = async (preOrderId) => {
        try {
            setVerifyLoading(preOrderId);
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${BASE_URL}/${id}/pre-order/${preOrderId}/verify`, {}, config);
            toast.success('Pre-order verified!');
            fetchPost(); // Refresh to get updated data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to verify pre-order');
        } finally {
            setVerifyLoading(null);
        }
    };

    const handleMarkReady = async () => {
        try {
            setMarkReadyLoading(true);
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${BASE_URL}/${id}/mark-ready`, {}, config);
            toast.success('Product marked as ready!');
            fetchPost(); // Refresh to get updated data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to mark product as ready');
        } finally {
            setMarkReadyLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
                <Header showMenuButton={false} />
                <main className="flex-1 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-[#e50914]"></span>
                </main>
                <Footer />
            </div>
        );
    }

    if (!post) return null;

    // Ensure both IDs are compared as numbers to avoid type mismatch
    const isSeller = Number(currentUserId) === Number(post.sellerId);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header showMenuButton={false} />
            <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6">
                        <GoBackButton />
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8 min-h-[300px]">
                            {post.images && post.images.length > 0 ? (
                                <img src={post.images[0]} alt={post.title} className="max-w-full max-h-[400px] object-contain rounded-lg shadow-sm" />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span>No image provided</span>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/2 p-6 lg:p-10 flex flex-col">
                            <div className="mb-2 flex justify-between items-start">
                                <span className="badge bg-red-50 text-[#8b0018] border-[#8b0018]">{post.category}</span>
                                <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                                {isSeller && post.preOrderEnabled && post.productStatus !== 'ready' && (
                                    <button
                                        onClick={handleMarkReady}
                                        disabled={markReadyLoading}
                                        className="btn btn-sm btn-info text-white ml-2"
                                    >
                                        {markReadyLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Mark Ready'}
                                    </button>
                                )}
                                {isSeller && post.preOrderEnabled && post.productStatus === 'ready' && (
                                    <span className="badge badge-success ml-2">Product Ready</span>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-[#8b0018] mb-6">৳ {post.price}</div>

                            <div className="prose prose-sm text-gray-600 mb-8 whitespace-pre-line flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                <p>{post.description}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                                <div className="flex items-center text-gray-700">
                                    <span className="font-semibold w-24">Seller:</span>
                                    <span>{post.sellerName}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <span className="font-semibold w-24">Location:</span>
                                    <span>{post.location}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <span className="font-semibold w-24">Contact:</span>
                                    <a href={`tel:${post.phone_number}`} className="text-[#8b0018] font-medium hover:underline">{post.phone_number}</a>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto border-t pt-6">
                                {post.preOrderEnabled ? (
                                    // Pre-order flow
                                    <>
                                        {isSeller ? (
                                            // Seller view - show button to open pre-orders modal
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => setShowPreOrderModal(true)}
                                                    className="btn bg-gradient-to-r from-[#e50914] to-[#b00020] hover:opacity-90 text-white border-none w-full shadow-lg"
                                                >
                                                    View Pre-Orders ({post.preOrders?.length || 0})
                                                </button>
                                            </div>
                                        ) : userPreOrder ? (
                                            // User has submitted a pre-order
                                            <div className="space-y-3">
                                                {userPreOrder.verified && post.productStatus === 'ready' ? (
                                                    // Product is verified and ready - show collection notice only
                                                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
                                                        <div className="font-bold flex items-center justify-center gap-2 mb-3">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            Product Ready for Collection!
                                                        </div>
                                                        <p className="text-sm text-center mb-3">
                                                            Your order has been verified and is ready to collect.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    // Still pending or preparing
                                                    <>
                                                        <div className="bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-4">
                                                            <div className="font-bold flex items-center justify-between mb-2">
                                                                <span>Pre-Order Submitted</span>
                                                                {userPreOrder.verified ? (
                                                                    <span className="badge badge-success">✓ Verified</span>
                                                                ) : (
                                                                    <span className="badge badge-warning">Pending Verification</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm mb-1">Transaction ID: <span className="font-mono font-semibold">{userPreOrder.transactionId}</span></p>
                                                            {!userPreOrder.verified && (
                                                                <p className="text-xs mt-2">Waiting for seller to verify your payment.</p>
                                                            )}
                                                        </div>
                                                        {userPreOrder.verified && (
                                                            <div className="bg-yellow-50 border-yellow-200 text-yellow-800 border rounded-lg p-4">
                                                                <div className="font-bold flex items-center justify-center gap-2 mb-1">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                    Preparing Your Order
                                                                </div>
                                                                <p className="text-sm text-center">
                                                                    The seller will notify when product is ready.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            // Pre-order form for buyers
                                            !isSeller && (
                                                <form onSubmit={handlePreOrderSubmit} className="space-y-3">
                                                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-blue-900">
                                                        <h3 className="font-bold mb-2 flex items-center gap-2">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            Pre-Order Available
                                                        </h3>
                                                        <p className="text-sm">Pay ৳{post.price} via bKash to <strong>{post.phone_number}</strong>, then enter your transaction ID below.</p>
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">bKash Transaction ID</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={transactionId}
                                                            onChange={(e) => setTransactionId(e.target.value)}
                                                            placeholder="Enter transaction ID"
                                                            className="input input-bordered focus:border-[#8b0018] w-full"
                                                            required
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={actionLoading}
                                                        className="btn bg-gradient-to-r from-[#e50914] to-[#b00020] hover:opacity-90 text-white border-none w-full shadow-lg"
                                                    >
                                                        {actionLoading ? <span className="loading loading-spinner"></span> : 'Submit Pre-Order'}
                                                    </button>
                                                </form>
                                            )
                                        )}
                                    </>
                                ) : (
                                    // Regular payment flow
                                    <>
                                        {post.paymentStatus === 'Payment Done' ? (
                                            <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 text-center">
                                                <div className="font-bold flex items-center justify-center gap-2 mb-1">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Payment Marked as Done
                                                </div>
                                                {isSeller ? (
                                                    <p className="text-sm">Please verify the payment and confirm in "My Posts" to remove this listing.</p>
                                                ) : (
                                                    <p className="text-sm">Waiting for the seller to confirm payment.</p>
                                                )}
                                            </div>
                                        ) : (
                                            !isSeller && (
                                                <button
                                                    onClick={handlePaymentDone}
                                                    disabled={actionLoading}
                                                    className="btn bg-gradient-to-r from-[#e50914] to-[#b00020] hover:opacity-90 text-white border-none w-full shadow-lg"
                                                >
                                                    {actionLoading ? <span className="loading loading-spinner"></span> : 'Mark Payment as Done'}
                                                </button>
                                            )
                                        )}
                                        {isSeller && post.paymentStatus === 'Pending' && (
                                            <div className="text-center text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100 italic">
                                                You are the seller of this item.
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </main>

            {/* Pre-Order Modal */}
            {showPreOrderModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-xl mb-4 text-gray-900">Pre-Order Management</h3>
                        
                        {post.preOrders && post.preOrders.length > 0 ? (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                                {post.preOrders.map(preOrder => (
                                    <div key={preOrder._id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 text-lg">{preOrder.userName}</p>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    <span className="font-medium">Transaction ID:</span> 
                                                    <span className="font-mono font-semibold ml-2 bg-white px-2 py-1 rounded">{preOrder.transactionId}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(preOrder.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="ml-4">
                                                {preOrder.verified ? (
                                                    <span className="badge badge-success badge-lg">✓ Verified</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleVerifyPreOrder(preOrder._id)}
                                                        disabled={verifyLoading === preOrder._id}
                                                        className="btn btn-success text-white"
                                                    >
                                                        {verifyLoading === preOrder._id ? (
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                        ) : (
                                                            'Verify'
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-8">No pre-orders yet.</p>
                        )}
                        
                        <div className="modal-action">
                            <button onClick={() => setShowPreOrderModal(false)} className="btn">Close</button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowPreOrderModal(false)}></div>
                </div>
            )}

            <Footer />
        </div>
    );
}
