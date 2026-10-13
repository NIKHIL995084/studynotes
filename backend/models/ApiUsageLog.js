const mongoose = require("mongoose");

const ApiUsageLogSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true,
        enum: ["gemini", "groq", "openrouter", "cerebras", "huggingface", "sambanova", "academic_fallback"]
    },
    endpoint: {
        type: String,
        default: "/api/generate-notes"
    },
    topic: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["success", "fallback", "error"],
        default: "success"
    },
    latencyMs: {
        type: Number,
        default: 0
    },
    errorMessage: {
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

module.exports = mongoose.models.ApiUsageLog || mongoose.model("ApiUsageLog", ApiUsageLogSchema);
