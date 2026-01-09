// src/components/FeedbackForm.jsx
import { useState } from "react";
import { CATEGORIES } from "../constants/categories";
import { submitFeedback } from "../api/feedbackApi";
import "../styles/form.css";

export default function FeedbackForm() {
    const [form, setForm] = useState({
        category: "",
        title: "",
        message: ""
    });
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category || !form.message.trim()) return;

        await submitFeedback(form);
        setSuccess(true);
        setForm({ category: "", title: "", message: "" });
    };

    return (
        <form className="feedback-form" onSubmit={handleSubmit}>
            <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
            >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Title (optional)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
                placeholder="Write your feedback..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
            />

            <button type="submit">Submit Feedback</button>

            {success && <p className="success">Feedback submitted anonymously ✔</p>}
        </form>
    );
}
