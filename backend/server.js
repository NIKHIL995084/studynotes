const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();

// Mongoose Models
const User = require("./models/User");
const Note = require("./models/Note");
const QuizAttempt = require("./models/QuizAttempt");
const MockTest = require("./models/MockTest");
const Bookmark = require("./models/Bookmark");
const ApiUsageLog = require("./models/ApiUsageLog");

// AI & Academic Services
const { generateAcademicNotes, generateMcqQuiz, generateQuickRevision } = require("./services/aiService");
const { pyqBank, searchPyq } = require("./services/pyqData");

const app = express();

// Security & Cross-Origin Resource Sharing
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Private-Network", "true");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Serve Frontend Static Assets
app.use(express.static(path.join(__dirname, "..")));

// MongoDB Database Connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error("[FATAL ERROR] MONGO_URI is missing in environment variables. Please check your .env file.");
} else {
    mongoose.connect(mongoUri, {
        dbName: "studynotes"
    })
    .then(() => console.log("[MONGODB] Connected Successfully to MongoDB Atlas (studynotes)!"))
    .catch((error) => console.error("[MONGODB] Connection Error:", error.message));
}

// ============================================================================
// 1. AUTHENTICATION CONTROLLERS (REGISTER & LOGIN)
// ============================================================================

const handleRegister = async (req, res) => {
    try {
        const { name, email, password, grade, subject, institution, phone } = req.body;

        if (!name || !email || !password || password.length < 6) {
            return res.status(400).json({
                message: "Full name, valid email, and password of at least 6 characters are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered. Please sign in instead."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            grade: grade || "college",
            subject: subject || "general",
            institution: institution ? institution.trim() : "",
            phone: phone ? phone.trim() : ""
        });

        // Mirror sync to ensure visibility across legacy collections
        try {
            await mongoose.connection.db.collection('user').replaceOne(
                { email: normalizedEmail },
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    grade: user.grade,
                    subject: user.subject,
                    createdAt: user.createdAt
                },
                { upsert: true }
            );
        } catch (syncErr) {
            // Non-critical mirror notice
        }

        console.log(`[AUTH] Student Registered: ${user.name} (${user.email})`);

        res.status(201).json({
            message: "Student account created successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                grade: user.grade,
                subject: user.subject
            }
        });
    } catch (error) {
        console.error("[AUTH] Registration Error:", error.message);
        res.status(500).json({
            message: "Registration failed on server. Please try again."
        });
    }
};

app.post("/register", handleRegister);
app.post("/api/register", handleRegister);

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        console.log(`[AUTH] Student Authenticated: ${user.name} (${user.email})`);

        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                grade: user.grade,
                subject: user.subject
            }
        });
    } catch (error) {
        console.error("[AUTH] Login Error:", error.message);
        res.status(500).json({
            message: "Login failed on server. Please try again."
        });
    }
};

app.post("/login", handleLogin);
app.post("/api/login", handleLogin);

// Verification Route: List users safely (excluding password)
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.status(200).json({
            database: "studynotes",
            cluster: "Cluster0 (MongoDB Atlas Cloud)",
            totalUsers: users.length,
            users: users
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// 2. AI STUDY NOTES GENERATION & VAULT APIS
// ============================================================================

// POST /api/generate-notes
app.post("/api/generate-notes", async (req, res) => {
    try {
        const { topic, grade, subject, format, difficulty, language, includeExamples, includeDiagrams, includeQuestions } = req.body;

        if (!topic || topic.trim().length === 0) {
            return res.status(400).json({ error: "Topic name is required." });
        }

        const result = await generateAcademicNotes(topic, {
            grade,
            subject,
            format,
            difficulty,
            language,
            includeExamples,
            includeDiagrams,
            includeQuestions
        });

        res.status(200).json(result);
    } catch (err) {
        console.error("[NOTES GENERATION] Error:", err.message);
        res.status(500).json({ error: "Failed to generate academic study notes." });
    }
});

// POST /api/notes - Save Note to Vault
app.post("/api/notes", async (req, res) => {
    try {
        const { userEmail, userName, topic, title, meta, format, subject, difficulty, language, concepts, formula, tip, flowchart, practiceQuestions } = req.body;

        if (!userEmail || !title) {
            return res.status(400).json({ error: "User email and note title are required." });
        }

        const newNote = await Note.create({
            userEmail: userEmail.trim().toLowerCase(),
            userName: userName || "Student",
            topic: topic || title,
            title: title,
            meta: meta || "Saved Academic Note",
            format: format || "Detailed Academic Notes",
            subject: subject || "General",
            difficulty: difficulty || "Intermediate",
            language: language || "English",
            concepts: concepts || [],
            formula: formula || "",
            tip: tip || "",
            flowchart: flowchart || "",
            practiceQuestions: practiceQuestions || []
        });

        console.log(`[VAULT] Saved Note for: ${userEmail} -> "${title}"`);

        res.status(201).json({
            message: "Note saved successfully to your MongoDB Student Vault!",
            note: newNote
        });
    } catch (err) {
        console.error("[VAULT SAVE] Error:", err.message);
        res.status(500).json({ error: "Failed to save note to database." });
    }
});

// GET /api/notes - Retrieve Student's Saved Notes
app.get("/api/notes", async (req, res) => {
    try {
        const { email } = req.query;
        const query = email ? { userEmail: email.trim().toLowerCase() } : {};
        const notes = await Note.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            total: notes.length,
            notes: notes
        });
    } catch (err) {
        console.error("[VAULT GET] Error:", err.message);
        res.status(500).json({ error: "Failed to fetch notes from database." });
    }
});

// PUT /api/notes/:id - Update / Edit Note Content
app.put("/api/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, concepts, formula, tip } = req.body;

        const updated = await Note.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(concepts && { concepts }),
                ...(formula && { formula }),
                ...(tip && { tip })
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Note not found." });
        }

        res.status(200).json({
            message: "Note updated successfully!",
            note: updated
        });
    } catch (err) {
        console.error("[VAULT UPDATE] Error:", err.message);
        res.status(500).json({ error: "Failed to update note." });
    }
});

// PATCH /api/notes/:id/bookmark - Toggle Note Bookmark
app.patch("/api/notes/:id/bookmark", async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ error: "Note not found." });

        note.isBookmarked = !note.isBookmarked;
        await note.save();

        res.status(200).json({
            message: note.isBookmarked ? "Bookmarked note." : "Removed bookmark.",
            isBookmarked: note.isBookmarked
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/notes/:id - Delete Note
app.delete("/api/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Note.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Note not found." });
        }

        res.status(200).json({
            message: "Note deleted successfully from vault.",
            deletedId: id
        });
    } catch (err) {
        console.error("[VAULT DELETE] Error:", err.message);
        res.status(500).json({ error: "Failed to delete note." });
    }
});

// ============================================================================
// 3. QUICK REVISION & FLASHCARDS APIS
// ============================================================================

app.post("/api/revision/generate", async (req, res) => {
    try {
        const { topic, subject } = req.body;
        if (!topic) return res.status(400).json({ error: "Topic is required." });

        const revisionData = await generateQuickRevision(topic, subject || "General");
        res.status(200).json({
            success: true,
            data: revisionData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// 4. MCQ PRACTICE & QUIZ ENGINE APIS
// ============================================================================

// POST /api/mcq/generate - Generate 5-Question MCQ Quiz
app.post("/api/mcq/generate", async (req, res) => {
    try {
        const { topic, subject, difficulty, count } = req.body;
        if (!topic) return res.status(400).json({ error: "Topic is required." });

        const questions = await generateMcqQuiz(topic, {
            subject: subject || "General",
            difficulty: difficulty || "Intermediate",
            count: count || 5
        });

        res.status(200).json({
            success: true,
            topic: topic,
            total: questions.length,
            questions: questions
        });
    } catch (err) {
        console.error("[MCQ GENERATE] Error:", err.message);
        res.status(500).json({ error: "Failed to generate MCQ quiz." });
    }
});

// POST /api/mcq/submit - Submit Quiz & Record Score
app.post("/api/mcq/submit", async (req, res) => {
    try {
        const { userEmail, topic, subject, difficulty, questions, selectedAnswers, timeSpentSeconds } = req.body;

        if (!userEmail || !questions || !selectedAnswers) {
            return res.status(400).json({ error: "Missing required quiz submission fields." });
        }

        let score = 0;
        const total = questions.length;
        const evaluatedAnswers = questions.map((q, idx) => {
            const selected = selectedAnswers[idx];
            const isCorrect = selected === q.correctIndex;
            if (isCorrect) score += 1;

            return {
                question: q.question,
                selectedOption: selected,
                correctOption: q.correctIndex,
                isCorrect: isCorrect,
                explanation: q.explanation || "Standard curriculum concept."
            };
        });

        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

        const attempt = await QuizAttempt.create({
            userEmail: userEmail.trim().toLowerCase(),
            topic: topic || "General Quiz",
            subject: subject || "General",
            difficulty: difficulty || "Intermediate",
            score: score,
            totalQuestions: total,
            percentage: percentage,
            timeSpentSeconds: timeSpentSeconds || 0,
            answers: evaluatedAnswers
        });

        console.log(`[QUIZ ATTEMPT] ${userEmail} completed quiz on "${topic}": ${score}/${total} (${percentage}%)`);

        res.status(200).json({
            message: "Quiz submitted and evaluated successfully!",
            score: score,
            totalQuestions: total,
            percentage: percentage,
            evaluatedAnswers: evaluatedAnswers,
            attemptId: attempt._id
        });
    } catch (err) {
        console.error("[MCQ SUBMIT] Error:", err.message);
        res.status(500).json({ error: "Failed to submit quiz attempt." });
    }
});

// GET /api/mcq/history - Student's Quiz History
app.get("/api/mcq/history", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: "User email required." });

        const history = await QuizAttempt.find({ userEmail: email.trim().toLowerCase() })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            total: history.length,
            history: history
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// 5. PREVIOUS YEAR QUESTIONS (PYQ) APIS
// ============================================================================

app.get("/api/pyq/list", (req, res) => {
    res.status(200).json({
        total: pyqBank.length,
        pyqs: pyqBank
    });
});

app.get("/api/pyq/search", (req, res) => {
    const { q, exam, subject } = req.query;
    const results = searchPyq(q, exam, subject);
    res.status(200).json({
        total: results.length,
        pyqs: results
    });
});

// ============================================================================
// 6. MOCK TEST SIMULATOR APIS
// ============================================================================

// POST /api/mock/generate - Generate 10-Question Exam Simulator Test
app.post("/api/mock/generate", async (req, res) => {
    try {
        const { subject, examType, difficulty } = req.body;
        const testSubject = subject || "Physics & Chemistry";

        // Generate high-yield mixed questions
        const questions = await generateMcqQuiz(testSubject, {
            count: 10,
            difficulty: difficulty || "Intermediate",
            subject: testSubject
        });

        res.status(200).json({
            success: true,
            testTitle: `${examType || "Comprehensive"} Full Mock Test`,
            subject: testSubject,
            durationMinutes: 15,
            totalQuestions: questions.length,
            markingScheme: {
                correct: 4,
                incorrect: -1
            },
            questions: questions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/mock/submit - Submit Mock Test
app.post("/api/mock/submit", async (req, res) => {
    try {
        const { userEmail, testTitle, subject, examType, questions, selectedAnswers, negativeMarking, durationMinutes, timeSpentSeconds } = req.body;

        if (!userEmail || !questions) {
            return res.status(400).json({ error: "Missing required mock test submission fields." });
        }

        let correctCount = 0;
        let incorrectCount = 0;
        let attemptedCount = 0;

        questions.forEach((q, idx) => {
            const sel = selectedAnswers[idx];
            if (sel !== undefined && sel !== null && sel !== -1) {
                attemptedCount++;
                if (sel === q.correctIndex) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }
            }
        });

        const perCorrect = 4;
        const perIncorrect = negativeMarking ? 1 : 0;
        const score = (correctCount * perCorrect) - (incorrectCount * perIncorrect);
        const maxMarks = questions.length * perCorrect;

        const mockRecord = await MockTest.create({
            userEmail: userEmail.trim().toLowerCase(),
            testTitle: testTitle || "Standard Mock Test",
            subject: subject || "General",
            examType: examType || "National Exam",
            totalQuestions: questions.length,
            attemptedCount: attemptedCount,
            correctCount: correctCount,
            incorrectCount: incorrectCount,
            score: score,
            maxMarks: maxMarks,
            negativeMarking: !!negativeMarking,
            durationMinutes: durationMinutes || 15,
            timeSpentSeconds: timeSpentSeconds || 0
        });

        res.status(200).json({
            message: "Mock test scored and recorded successfully!",
            record: mockRecord
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// 7. STUDENT DASHBOARD AGGREGATION API
// ============================================================================

app.get("/api/dashboard/stats", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: "Student email is required for dashboard statistics." });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Query collections in parallel
        const [user, totalNotes, savedNotes, quizAttempts, mockTests, bookmarks] = await Promise.all([
            User.findOne({ email: normalizedEmail }, { password: 0 }),
            Note.countDocuments({ userEmail: normalizedEmail }),
            Note.find({ userEmail: normalizedEmail }).sort({ createdAt: -1 }).limit(6),
            QuizAttempt.find({ userEmail: normalizedEmail }).sort({ createdAt: -1 }).limit(10),
            MockTest.find({ userEmail: normalizedEmail }).sort({ createdAt: -1 }).limit(10),
            Bookmark.find({ userEmail: normalizedEmail }).sort({ createdAt: -1 }).limit(10)
        ]);

        // Calculate average accuracy
        let avgQuizAccuracy = 0;
        if (quizAttempts.length > 0) {
            const sumPercentage = quizAttempts.reduce((acc, q) => acc + (q.percentage || 0), 0);
            avgQuizAccuracy = Math.round(sumPercentage / quizAttempts.length);
        }

        res.status(200).json({
            success: true,
            student: user || { name: "Student", email: normalizedEmail },
            stats: {
                totalNotesCreated: totalNotes,
                totalQuizzesAttempted: quizAttempts.length,
                averageQuizAccuracy: avgQuizAccuracy,
                totalMockTests: mockTests.length,
                totalBookmarks: bookmarks.length
            },
            recentNotes: savedNotes,
            recentQuizzes: quizAttempts,
            recentMockTests: mockTests,
            bookmarks: bookmarks
        });
    } catch (err) {
        console.error("[DASHBOARD STATS] Error:", err.message);
        res.status(500).json({ error: "Failed to compile student dashboard telemetry." });
    }
});

// ============================================================================
// 8. SYSTEM TELEMETRY & AI HEALTH
// ============================================================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "online",
        platform: "Study Notes AI",
        owner: "Nikhil Tetarwal",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

app.get("/api/ai-status", (req, res) => {
    res.status(200).json({
        providers: {
            gemini: !!process.env.GEMINI_API_KEY,
            groq: !!process.env.GROQ_API_KEY,
            openrouter: !!process.env.OPENROUTER_API_KEY,
            cerebras: !!process.env.CEREBRAS_API_KEY,
            sambanova: !!process.env.SAMBANOVA_API_KEY,
            huggingface: !!(process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY),
            academic_fallback: true
        },
        fallbackReady: true
    });
});

// Render Health Check endpoint
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Root Route fallback
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`[STUDY NOTES SERVER] Running on port ${PORT} (0.0.0.0) • Owner: Nikhil Tetarwal`);
});