const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Full name is required"], 
        trim: true 
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: { 
        type: String, 
        required: [true, "Password is required"] 
    },
    grade: { 
        type: String, 
        default: "college" 
    },
    subject: { 
        type: String, 
        default: "general" 
    },
    institution: { 
        type: String, 
        default: "", 
        trim: true 
    },
    phone: { 
        type: String, 
        default: "", 
        trim: true 
    },
    role: { 
        type: String, 
        default: "student", 
        enum: ["student", "educator", "admin"] 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
