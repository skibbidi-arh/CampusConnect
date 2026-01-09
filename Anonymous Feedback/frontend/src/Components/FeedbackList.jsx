// src/components/FeedbackList.jsx
import FeedbackItem from "./FeedbackItem";

export default function FeedbackList({ feedbacks }) {
    if (!feedbacks.length) return <p>No feedback yet.</p>;

    return feedbacks.map((fb) => (
        <FeedbackItem key={fb._id} feedback={fb} />
    ));
}
