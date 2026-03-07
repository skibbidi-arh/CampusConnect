import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoBackButton from '../../components/GoBackButton';
import { AuthContext } from '../../context/AuthContext';

const CATEGORIES = [
    'Home items',
    'Laptop, PC and PC parts',
    'Books, Study materials',
    'Bikes and cycles',
    'Clothing',
    'Others'
];

const BASE_URL = 'http://localhost:4000/api/marketplace';

export default function EditMarketplacePost() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        category: CATEGORIES[0],
        description: '',
        price: '',
        phone_number: '',
        image: '',
        preOrderEnabled: false
    });
    const [loading, setLoading] = useState(false);
    const [fetchingPost, setFetchingPost] = useState(true);
    const [originalImage, setOriginalImage] = useState('');
    const navigate = useNavigate();
    const { User } = AuthContext();
    const currentUserId = User?.users_id;

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setFetchingPost(true);
            const token = sessionStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.get(`${BASE_URL}/${id}`, config);
            if (res.data.success) {
                const post = res.data.post;

                // Check if user is the seller
                if (Number(currentUserId) !== Number(post.sellerId)) {
                    toast.error('You are not authorized to edit this post');
                    navigate('/marketplace');
                    return;
                }

                // Pre-populate form
                setFormData({
                    title: post.title || '',
                    category: post.category || CATEGORIES[0],
                    description: post.description || '',
                    price: post.price || '',
                    phone_number: post.phone_number || '',
                    image: post.images?.[0] || '',
                    preOrderEnabled: post.preOrderEnabled || false
                });
                setOriginalImage(post.images?.[0] || '');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            toast.error('Failed to load post details');
            navigate('/marketplace');
        } finally {
            setFetchingPost(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    toast.error("Image size should be less than 5MB");
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({ ...formData, image: reader.result });
                };
                reader.readAsDataURL(file);
            }
        } else if (e.target.type === 'checkbox') {
            setFormData({ ...formData, [e.target.name]: e.target.checked });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                toast.error('You must be logged in to update');
                navigate('/login');
                return;
            }

            const payload = { ...formData, images: formData.image ? [formData.image] : [] };

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put(`${BASE_URL}/${id}`, payload, config);

            if (res.data.success) {
                toast.success('Item updated successfully!');
                navigate(`/marketplace/${id}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error(error.response?.data?.message || 'Failed to update item');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingPost) {
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

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header showMenuButton={false} />
            <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6 flex items-center gap-4">
                        <GoBackButton />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Your Post</h1>
                            <p className="mt-1 text-sm text-gray-600">Update your marketplace listing</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-medium text-gray-700">Title</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input input-bordered focus:border-[#8b0018] w-full" placeholder="What are you selling?" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-medium text-gray-700">Category</span></label>
                                <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered focus:border-[#8b0018] w-full">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-medium text-gray-700">Price (৳)</span></label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="input input-bordered focus:border-[#8b0018] w-full" placeholder="0.00" />
                            </div>
                        </div>

                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-medium text-gray-700">Description</span></label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required className="textarea textarea-bordered focus:border-[#8b0018] h-24" placeholder="Describe the item..."></textarea>
                        </div>

                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-medium text-gray-700">Phone Number</span></label>
                            <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="input input-bordered focus:border-[#8b0018] w-full" placeholder="Your contact number" />
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-3">
                                <input 
                                    type="checkbox" 
                                    name="preOrderEnabled" 
                                    checked={formData.preOrderEnabled} 
                                    onChange={handleChange} 
                                    className="checkbox checkbox-error" 
                                />
                                <div>
                                    <span className="label-text font-medium text-gray-700">Enable Pre-Order</span>
                                    <p className="text-sm text-gray-500 mt-1">Allow users to pre-order and pay via bKash before product is ready</p>
                                </div>
                            </label>
                        </div>

                        <div className="form-control w-full mb-6">
                            <label className="label"><span className="label-text font-medium text-gray-700">Upload Image</span></label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="file-input file-input-bordered focus:border-[#8b0018] w-full"
                            />
                            <label className="label"><span className="label-text-alt text-gray-500">Upload a new photo to replace the current one (Max 5MB)</span></label>

                            {formData.image && (
                                <div className="mt-4 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="btn btn-sm btn-circle btn-error absolute top-2 right-2 text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => navigate(`/marketplace/${id}`)}
                                className="btn btn-ghost flex-1"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="btn bg-gradient-to-r from-[#e50914] to-[#b00020] hover:opacity-90 text-white border-none flex-1 shadow-md"
                            >
                                {loading ? <span className="loading loading-spinner"></span> : 'Update Post'}
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
