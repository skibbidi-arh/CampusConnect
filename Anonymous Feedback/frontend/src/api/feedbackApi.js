import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const submitFeedback = (data) =>
    axios.post(`${API_BASE}/feedback`, data);

export const getFeedbackByCategory = (category) =>
    axios.get(`${API_BASE}/feedback/${category}`);
