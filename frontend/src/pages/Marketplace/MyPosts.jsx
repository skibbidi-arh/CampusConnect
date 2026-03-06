import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BASE_URL = 'http://localhost:4000/api/marketplace';

export default function MyMarketplacePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.get(`${BASE_URL}/my-posts`, config);
            if (res.data.success) {
                setPosts(res.data.posts);
            }
        } catch (error) {
            console.error('Error fetching my posts:', error);
            toast.error('Failed to load your posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${BASE_URL}/${id}`, config);
            toast.success('Post deleted');
            setPosts(posts.filter(p => p._id !== id));
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const handleConfirmPayment = async (id) => {
        try {
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${BASE_URL}/${id}/confirm-payment`, {}, config);
            toast.success('Payment confirmed! Item removed from marketplace.');
            setPosts(posts.filter(p => p._id !== id)); // Remove from UI as it's sold
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to confirm payment');
        }
    };
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-[#8b0018] mb-6">My Posts</h1>

                {loading ? (
                    <div className="text-center py-20">
                        <span className="loading loading-spinner loading-lg text-[#8b0018]"></span>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl text-gray-500 font-medium">You haven't posted any items</h3>
                        <button onClick={() => navigate('/marketplace/create')} className="btn bg-[#8b0018] hover:bg-[#b00020] text-white mt-4">
                            Add Post
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <div key={post._id} className="card bg-base-100 shadow-xl border border-gray-200">
                                <div className="card-body p-5">
                                    <div className="flex justify-between items-start">
                                        <h2 className="card-title text-lg font-bold">{post.title}</h2>
                                        <div className={`badge ${post.paymentStatus === 'Payment Done' ? 'badge-success text-white' : 'badge-ghost'}`}>
                                            {post.paymentStatus}
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-2">৳ {post.price} • {post.category}</p>

                                    {post.paymentStatus === 'Payment Done' && (
                                        <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm mb-2 border border-green-200">
                                            <strong>Payment Action Required!</strong>
                                            <p>Buyer ({post.buyerName}) marked payment as done.</p>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-4 border-t pt-4">
                                        {post.paymentStatus === 'Payment Done' && (
                                            <button
                                                onClick={() => handleConfirmPayment(post._id)}
                                                className="btn btn-sm btn-success text-white"
                                            >
                                                Confirm Payment
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/marketplace/${post._id}`)}
                                            className="btn btn-sm btn-outline border-gray-300"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="btn btn-sm btn-error text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
