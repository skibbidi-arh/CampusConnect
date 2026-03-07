import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoBackButton from '../../components/GoBackButton';

const BASE_URL = 'http://localhost:4000/api/marketplace';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.get(`${BASE_URL}/my-orders`, config);
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error('Error fetching my orders:', error);
            toast.error('Failed to load your orders');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header showMenuButton={false} />
            <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex items-center gap-4">
                        <GoBackButton />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">My Orders</h1>
                            <p className="mt-1 text-sm text-gray-600">Track your pre-orders and purchases</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <span className="loading loading-spinner loading-lg text-[#e50914]"></span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-xl text-gray-500 font-medium">You haven't made any orders yet</h3>
                            <button onClick={() => navigate('/marketplace')} className="btn bg-gradient-to-r from-[#e50914] to-[#b00020] hover:opacity-90 text-white border-none mt-4">
                                Browse Marketplace
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map(order => (
                                <div key={order.postId} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                                    {order.images && order.images.length > 0 && (
                                        <figure className="h-48 bg-gray-100">
                                            <img 
                                                src={order.images[0]} 
                                                alt={order.title}
                                                className="w-full h-full object-contain"
                                            />
                                        </figure>
                                    )}
                                    <div className="card-body p-5">
                                        <h2 className="card-title text-lg font-bold text-gray-800">{order.title}</h2>
                                        <p className="text-gray-500 text-sm mb-2">৳ {order.price} • {order.category}</p>

                                        <div className="bg-gray-50 rounded-lg p-3 text-sm mb-3 space-y-1">
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Seller:</span> {order.sellerName}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Location:</span> {order.location}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Contact:</span> {order.phone_number}
                                            </p>
                                        </div>

                                        {order.preOrder && (
                                            <div className="space-y-2">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                                                    <p className="font-semibold text-blue-900 mb-1">Your Pre-Order</p>
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Transaction ID:</span>
                                                        <br />
                                                        <span className="font-mono text-xs bg-white px-2 py-1 rounded mt-1 inline-block">
                                                            {order.preOrder.transactionId}
                                                        </span>
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className="font-medium">Status:</span>
                                                        {order.preOrder.verified ? (
                                                            <span className="badge badge-success badge-sm">✓ Verified</span>
                                                        ) : (
                                                            <span className="badge badge-warning badge-sm">Pending Verification</span>
                                                        )}
                                                    </div>
                                                    {order.preOrder.verified && (
                                                        <div className="mt-2">
                                                            {order.productStatus === 'ready' ? (
                                                                <div className="badge badge-success w-full py-3">
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                    </svg>
                                                                    Product Ready - Contact Seller
                                                                </div>
                                                            ) : (
                                                                <div className="badge badge-info w-full py-3">
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                    </svg>
                                                                    Preparing Your Order
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Ordered: {new Date(order.preOrder.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="card-actions justify-end mt-4 border-t pt-4">
                                            <button
                                                onClick={() => navigate(`/marketplace/${order.postId}`)}
                                                className="btn btn-sm btn-outline border-gray-300"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
