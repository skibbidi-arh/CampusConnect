const express = require("express");
const router = express.Router();
const {
    createFeedback,
    getAllFeedback,
    getFeedbackByCategory,
    getFeedbackById,
    addComment,
    deleteComment
} = require("../controllers/feedbackController");
const { validateFeedback, validateComment } = require("../middleware/sanitize");

router.post("/", validateFeedback, createFeedback);
router.get("/", getAllFeedback);
router.get("/category/:category", getFeedbackByCategory);
router.get("/:id", getFeedbackById);
router.post("/:id/comments", validateComment, addComment);
router.delete("/:feedbackId/comments/:commentId", deleteComment);

module.exports = router;
