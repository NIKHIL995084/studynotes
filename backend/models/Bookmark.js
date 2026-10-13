const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    itemType: {
        type: String,
        required: true,
        enum: ["note", "pyq", "mcq", "formula"]
    },
    title: {
        type: String,
        required: true
    },
    contentSnippet: {
        type: String,
        default: ""
    },
    referenceId: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Bookmark || mongoose.model("Bookmark", BookmarkSchema);
