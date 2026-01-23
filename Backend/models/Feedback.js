const mongoose = require("mongoose");

const CATEGORIES = [
    "Teachers",
    "Classrooms",
    "Authority",
    "Accounts Office",
    "Male Residential Hall Rooms",
    "Female Residential Hall Rooms",
    "Male Residential Hall Food",
    "Female Residential Hall Food",
    "Non-Residential Cafeteria Food",
    "Course Outline of a Department",
    "Bus Service",
    "Central Departmental Store",
    "Rocket (Small) Departmental Store",
    "Male Hall Gymnasium",
    "Female Hall Gymnasium",
    "Central Gymnasium",
    "Sports"
];

const feedbackSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: CATEGORIES,
            required: true
        },
        title: {
            type: String,
            trim: true,
            maxlength: 100
        },
        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 5
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
