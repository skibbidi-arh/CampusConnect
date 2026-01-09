// src/pages/CategoryFeedback.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFeedbackByCategory } from "../api/feedbackApi";
import FeedbackList from "../components/FeedbackList";

export default function CategoryFeedback() {
    const { category } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        getFeedbackByCategory(category).then(res => setFeedbacks(res.data));
    }, [category]);

    return (
        <div className="page">
            <h2>{category}</h2>
            <FeedbackList feedbacks={feedbacks} />
        </div>
    );
}
