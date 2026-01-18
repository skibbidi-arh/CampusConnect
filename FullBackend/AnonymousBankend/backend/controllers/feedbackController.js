const Feedback = require("../models/Feedback");
const { validationResult } = require("express-validator");

// POST /api/feedback
exports.createFeedback = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { category, title, message } = req.body;

        const feedback = await Feedback.create({
            category,
            title,
            message
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// GET /api/feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// GET /api/feedback/:category
exports.getFeedbackByCategory = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({
            category: req.params.category
        }).sort({ createdAt: -1 });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
