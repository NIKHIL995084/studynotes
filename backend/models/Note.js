const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    userEmail: { 
        type: String, 
        required: true, 
        lowercase: true, 
        trim: true, 
        index: true 
    },
    userName: { 
        type: String, 
        default: "Student" 
    },
    topic: { 
        type: String, 
        required: true, 
        trim: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    meta: { 
        type: String, 
        default: "Academic Syllabus • Exam Preparation" 
    },
    format: {
        type: String,
        default: "Detailed Academic Notes"
    },
    subject: {
        type: String,
        default: "General"
    },
    difficulty: {
        type: String,
        default: "Intermediate"
    },
    language: {
        type: String,
        default: "English"
    },
    concepts: [{ 
        type: String 
    }],
    formula: { 
        type: String, 
        default: "Key scientific and analytical formulations apply." 
    },
    tip: { 
        type: String, 
        default: "Revise high-yield concepts and practice active recall." 
    },
    flowchart: {
        type: String,
        default: ""
    },
    practiceQuestions: [{
        question: String,
        answer: String
    }],
    isBookmarked: {
        type: Boolean,
        default: false
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Note || mongoose.model("Note", NoteSchema);
