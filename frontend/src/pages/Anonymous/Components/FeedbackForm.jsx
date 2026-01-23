import { useState } from "react";
import { CATEGORIES } from "../constants/categories";
import { submitFeedback } from "../api/feedbackApi";
import toast from "react-hot-toast";

export default function FeedbackForm() {
    const [form, setForm] = useState({
        category: "",
        title: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.category || !form.message.trim()) {
            toast.error("Please select a category and write a message.");
            return;
        }

        setLoading(true);
        try {
            await submitFeedback(form);
            toast.success("Feedback submitted anonymously ✔");
            setForm({ category: "", title: "", message: "" });
        } catch (error) {
            toast.error("Failed to submit feedback. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Shared input styles for White & Red theme
    const inputClasses = "w-full px-4 py-3 mb-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none transition-all focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 placeholder-gray-400";

    return (
        <div className="flex justify-center items-center w-full py-10 bg-gray-50 min-h-[80vh]">
            <form
                className="w-full max-w-[550px] bg-white p-10 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50"
                onSubmit={handleSubmit}
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        IUT <span className="text-red-600">FEEDBACK</span>
                    </h2>
                    <p className="text-gray-500 text-xs mt-1 font-medium uppercase tracking-widest">
                        Submit your thoughts anonymously
                    </p>
                </div>

                {/* Category Select */}
                <div className="mb-2">
                    <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1.5 ml-1 block">
                        Target Category
                    </label>
                    <select
                        className={inputClasses}
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                    >
                        <option value="" disabled>Select a category...</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Title Input */}
                <div className="mb-2">
                    <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1.5 ml-1 block">
                        Subject Title
                    </label>
                    <input
                        className={inputClasses}
                        type="text"
                        placeholder="Brief summary of the issue"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                {/* Message Textarea */}
                <div className="mb-2">
                    <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1.5 ml-1 block">
                        Detailed Message
                    </label>
                    <textarea
                        className={`${inputClasses} min-h-[150px] resize-none`}
                        placeholder="Describe your experience or suggestion in detail..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        "Submit Anonymously"
                    )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2">
                    <div className="h-px w-8 bg-gray-200"></div>
                   
                    <div className="h-px w-8 bg-gray-200"></div>
                </div>
            </form>
        </div>
    );
}