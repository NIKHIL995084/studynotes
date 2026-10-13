const mongoose = require("mongoose");

const MockTestSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    testTitle: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: "General"
    },
    examType: {
        type: String,
        default: "Standard Exam"
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    attemptedCount: {
        type: Number,
        default: 0
    },
    correctCount: {
        type: Number,
        default: 0
    },
    incorrectCount: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    negativeMarking: {
        type: Boolean,
        default: false
    },
    durationMinutes: {
        type: Number,
        default: 15
    },
    timeSpentSeconds: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.MockTest || mongoose.model("MockTest", MockTestSchema);
