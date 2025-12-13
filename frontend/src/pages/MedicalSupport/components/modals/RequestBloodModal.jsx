import { X, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { AuthContext } from '../../../../context/AuthContext'
import { useRecieverContext } from '../../../../context/RecieverContext'

export default function RequestBloodModal({ isOpen, onClose }) {
    const { User } = AuthContext()
    const { createReciever } = useRecieverContext();

    const initialPhoneNumber = User?.phone_number || User?.user?.phone_number || '';

    // Form State
    const [formData, setFormData] = useState({
        blood_group: '',
        phone_number: initialPhoneNumber,
        deadline: '',
        location: '',
        // is_emergency: false,
    });
    
    const [submissionError, setSubmissionError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            // Handle checkbox state correctly
            [name]: type === 'checkbox' ? checked : value,
        }));
        setSubmissionError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError(null);
        setIsSubmitting(true);

        // Simple validation check
        if (!formData.blood_group || !formData.phone_number || !formData.location) {
            setSubmissionError('Please fill out the blood group, mobile number, and location.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Call the context function to create the request
            await createReciever(formData);
            
            // Success: Reset form and close modal
            setFormData({
                blood_group: '',
                phone_number: initialPhoneNumber,
                deadline: '',
                location: '',
                
            });
            
            onClose();

        } catch (error) {
            setSubmissionError(error.message || 'An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div  className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-[#e50914]">Submit Blood Request</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        disabled={isSubmitting}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>

                    {submissionError && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {submissionError}
                        </div>
                    )}
                    
                    {/* Blood Group */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Blood Group
                        </label>
                        <select 
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
                            required
                        >
                            <option value="">--- Select Group ---</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Mobile Number
                        </label>
                        <input
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            type="tel"
                            placeholder="e.g. 1234567890"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
                            required
                        />
                    </div>

                    {/* Blood Due Date */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Blood Due Date
                        </label>
                        <input
                            name="deadline"
                            value={formData.due_date}
                            onChange={handleChange}
                            type="date"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Location
                        </label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            type="text"
                            placeholder="City, Area"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
                            required
                        />
                    </div>

                    {/* Emergency Request Checkbox */}
                    <div className={`rounded-lg border-2 p-4 transition ${
                        formData.is_emergency 
                            ? 'border-[#e50914] bg-red-50' 
                            : 'border-gray-200 bg-gray-50'
                    }`}>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="is_emergency"
                                name="is_emergency"
                                checked={formData.is_emergency}
                                onChange={handleChange}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-[#e50914] focus:ring-2 focus:ring-[#e50914]/20"
                            />
                            <div className="flex-1">
                                <label 
                                    htmlFor="is_emergency" 
                                    className="cursor-pointer font-semibold text-gray-800 flex items-center gap-2"
                                >
                                    <AlertCircle className={`h-5 w-5 ${formData.is_emergency ? 'text-[#e50914]' : 'text-gray-500'}`} />
                                    Emergency Blood Request
                                </label>
                                <p className="mt-1 text-xs text-gray-600">
                                    Check this if blood is required within the next hour
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-full border-2 border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-full bg-gradient-to-r from-[#e50914] to-[#b00020] py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}