const { body } = require("express-validator");

exports.validateFeedback = [
    body("category").notEmpty().withMessage("Category is required"),
    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ min: 5 })
        .withMessage("Message must be at least 5 characters long"),
    body("title").optional().trim().escape()
];
