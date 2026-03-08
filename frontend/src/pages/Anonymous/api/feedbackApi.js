import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const submitFeedback = (data) =>
    
    axios.post(`${API_BASE}/feedback`, data);

export const getAllFeedback = () =>
    axios.get(`${API_BASE}/feedback`);

export const getFeedbackByCategory = (category) =>
    axios.get(`${API_BASE}/feedback/category/${category}`);

export const getFeedbackById = (id) =>
    axios.get(`${API_BASE}/feedback/${id}`);

export const addComment = (feedbackId, data) =>
    axios.post(`${API_BASE}/feedback/${feedbackId}/comments`, data);

export const deleteComment = (feedbackId, commentId) =>
    axios.delete(`${API_BASE}/feedback/${feedbackId}/comments/${commentId}`);

export const likeFeedback = (feedbackId, userId) =>
    axios.post(`${API_BASE}/feedback/${feedbackId}/like`, { userId });

export const unlikeFeedback = (feedbackId, userId) =>
    axios.post(`${API_BASE}/feedback/${feedbackId}/unlike`, { userId });

export const likeComment = (feedbackId, commentId, userId) =>
    axios.post(`${API_BASE}/feedback/${feedbackId}/comments/${commentId}/like`, { userId });

export const unlikeComment = (feedbackId, commentId, userId) =>
    axios.post(`${API_BASE}/feedback/${feedbackId}/comments/${commentId}/unlike`, { userId });
