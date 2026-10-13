const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        default: "General"
    },
    difficulty: {
        type: String,
        default: "Intermediate"
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    timeSpentSeconds: {
        type: Number,
        default: 0
    },
    answers: [{
        question: String,
        selectedOption: Number,
        correctOption: Number,
        isCorrect: Boolean,
        explanation: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.QuizAttempt || mongoose.model("QuizAttempt", QuizAttemptSchema);
