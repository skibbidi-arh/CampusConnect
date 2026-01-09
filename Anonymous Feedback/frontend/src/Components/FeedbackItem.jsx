
// src/components/FeedbackItem.jsx
import { formatDate } from "../utils/formatDate";

export default function FeedbackItem({ feedback }) {
    return (
        <div className="feedback-item">
            {feedback.title && <h4>{feedback.title}</h4>}
            <p>{feedback.message}</p>
            <span>{formatDate(feedback.createdAt)}</span>
        </div>
    );
}
