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
        console.log(category,title,message)

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

// GET /api/feedback/:id - Get single feedback with comments
exports.getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        
        res.json(feedback);
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Feedback not found" });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

// POST /api/feedback/:id/comments - Add a comment to feedback
exports.addComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { author, message } = req.body;
        
        const feedback = await Feedback.findById(req.params.id);
        
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        const newComment = {
            author: author || "Anonymous",
            message,
            createdAt: new Date()
        };

        feedback.comments.push(newComment);
        await feedback.save();

        res.status(201).json(feedback);
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Feedback not found" });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

// DELETE /api/feedback/:feedbackId/comments/:commentId - Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const { feedbackId, commentId } = req.params;
        
        const feedback = await Feedback.findById(feedbackId);
        
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        const commentIndex = feedback.comments.findIndex(
            comment => comment._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        feedback.comments.splice(commentIndex, 1);
        await feedback.save();

        res.json({ message: "Comment deleted successfully", feedback });
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Invalid ID" });
        }
        res.status(500).json({ message: "Server Error" });
    }
};
