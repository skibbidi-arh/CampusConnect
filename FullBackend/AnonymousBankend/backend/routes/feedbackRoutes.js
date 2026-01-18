const express = require("express");
const router = express.Router();
const {
    createFeedback,
    getAllFeedback,
    getFeedbackByCategory
} = require("../controllers/feedbackController");
const { validateFeedback } = require("../middleware/sanitize");

router.post("/", validateFeedback, createFeedback);
router.get("/", getAllFeedback);
router.get("/:category", getFeedbackByCategory);

module.exports = router;
