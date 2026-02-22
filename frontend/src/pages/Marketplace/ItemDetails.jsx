import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BASE_URL = 'http://localhost:4000/api/marketplace';

export default function MarketplaceItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const userStr = sessionStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentUserId = currentUser?.users_id || currentUser?._id; // depending on how user model is structured in frontend

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

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-[#8b0018]"></span>
                </main>
                <Footer />
            </div>
        );
    }

    if (!post) return null;

    const isSeller = currentUserId === post.sellerId;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
                <button onClick={() => navigate('/marketplace')} className="btn btn-ghost mb-4 text-[#8b0018] hover:bg-red-50">
                    &larr; Back to Marketplace
                </button>

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

                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
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
                                            className="btn bg-[#8b0018] hover:bg-[#b00020] text-white w-full shadow-lg"
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
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
