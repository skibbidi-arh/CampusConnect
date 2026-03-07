import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoBackButton from '../../components/GoBackButton';

const CATEGORIES = [
    'Home items',
    'Laptop, PC and PC parts',
    'Books, Study materials',
    'Bikes and cycles',
    'Others'
];

export default function CreateMarketplacePost() {
    const [formData, setFormData] = useState({
        title: '',
        category: CATEGORIES[0],
        description: '',
        location: '',
        price: '',
        phone_number: '',
        image: '', // Single image URL for simplicity, backend supports array
        preOrderEnabled: false
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                toast.error('You must be logged in to post');
                navigate('/login');
                return;
            }

            const payload = { ...formData, images: formData.image ? [formData.image] : [] };

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post('http://localhost:4000/api/marketplace', payload, config);

            if (res.data.success) {
                toast.success('Item posted successfully!');
                navigate('/marketplace');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error.response?.data?.message || 'Failed to post item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Header showMenuButton={false} />
            <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6 flex items-center gap-4">
                        <GoBackButton />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Post an Item for Sale</h1>
                            <p className="mt-1 text-sm text-gray-600">List your item on the campus marketplace</p>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-medium text-gray-700">Location</span></label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input input-bordered focus:border-[#8b0018] w-full" placeholder="e.g., South Hall, Room 302" />
                            </div>

                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-medium text-gray-700">Phone Number</span></label>
                                <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="input input-bordered focus:border-[#8b0018] w-full" placeholder="Your contact number" />
                            </div>
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
                            <label className="label"><span className="label-text-alt text-gray-500">Upload a photo of the item (Max 5MB)</span></label>

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

                        <button type="submit" disabled={loading} className="btn bg-gradient-to-r from-[#e50914] to-[#b00020] hover:opacity-90 text-white border-none w-full mt-4 shadow-md">
                            {loading ? <span className="loading loading-spinner"></span> : 'Post Item'}
                        </button>
                    </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
