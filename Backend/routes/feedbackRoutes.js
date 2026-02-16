const express = require("express");
const router = express.Router();
const {
    createFeedback,
    getAllFeedback,
    getFeedbackByCategory,
    getFeedbackById,
    addComment,
    deleteComment,
    likeFeedback,
    unlikeFeedback,
    likeComment,
    unlikeComment
} = require("../controllers/feedbackController");
const { validateFeedback, validateComment } = require("../middleware/sanitize");

router.post("/", validateFeedback, createFeedback);
router.get("/", getAllFeedback);
router.get("/category/:category", getFeedbackByCategory);
router.get("/:id", getFeedbackById);
router.post("/:id/comments", validateComment, addComment);
router.delete("/:feedbackId/comments/:commentId", deleteComment);
router.post("/:id/like", likeFeedback);
router.post("/:id/unlike", unlikeFeedback);
router.post("/:feedbackId/comments/:commentId/like", likeComment);
router.post("/:feedbackId/comments/:commentId/unlike", unlikeComment);

module.exports = router;
