# 📚 Study Notes — Intelligent AI Academic Platform

> **"Learn Smarter. Revise Faster. Score Better."**  
> **Project Lead & Creator:** Nikhil Tetarwal  
> **Platform Version:** 3.2 Production Edition  
> **Database:** MongoDB Atlas Cloud (`studynotes`)

---

## 🌟 Overview

**Study Notes** is a full-stack, responsive AI study platform. It transforms raw textbook material, lecture units, formulas, and complex academic syllabi into exam-oriented study sheets, 3D interactive flashcards, practice quizzes, and mock tests.

Designed with an international ed-tech visual design language (deep navy and crisp blue accents, high-contrast readable typography, soft neutral canvases, dark mode, and late-night eye-comfort mode), Study Notes adheres strictly to ergonomic accessibility standards—including the standard native OS mouse pointer (without oversized distracting cursors) and a lightweight 1.2-second SVG knowledge-reveal brand animation.

---

## 🚀 Key Features & Capabilities

### 1. 📝 12 High-Yield Note Generation Formats
Students can select their curriculum, grade level (Class 9-12, College Undergrad, Competitive Entrance, Postgrad), exam target (CBSE, JEE, NEET, University, UPSC), language (English, Hindi, Bilingual), difficulty, and output format:
1. **Detailed Academic Notes** — Complete theoretical foundations, mechanisms, and exam triggers.
2. **Simple Summary** — Plain-language overview for rapid grasp.
3. **Bullet Revision Notes** — Core takeaway bullets without filler.
4. **Concept Explainer** — Deep fundamental intuition and real-world analogies.
5. **Formula & Definition Sheet** — SI units, dimensional analysis, and standard equations.
6. **Mind Map / Text Flowchart** — Algorithmic pathway and process diagrams.
7. **Exam-Ready Answers** — Structured marking-scheme responses.
8. **Q&A / FAQ Format** — High-frequency student questions.
9. **Flashcard Set** — Active-recall questions and terms.
10. **MCQ Practice Set** — Multi-choice diagnostic questions with answer rationales.
11. **Case Study & Real-World Example** — Practical applications.
12. **Hindi / Bilingual Notes** — Vernacular academic explanations.

### 2. 🛠️ Action Toolbar
- **💾 Save to Vault:** Directly persists notes into the student's private collection in MongoDB Atlas.
- **✏️ Edit Notes:** One-click inline editable workbench to add personal classroom annotations.
- **🔄 Regenerate:** One-click re-synthesis with alternate parameters.
- **✂️ Shorten & 📖 Expand:** Dynamically adjusts granularity.
- **🌐 Translate:** Instant English <-> Hindi switching.
- **📋 Copy & 🖨️ Print:** Clean clipboard copy and print layouts.
- **⬇️ Export Markdown (.md):** Downloads formatted `.md` documents for offline study in Obsidian/Notion.
- **⭐ Bookmark:** Quick-access tagging.

### 3. ⚡ Quick Revision & Interactive 3D Flip Flashcards
- **5-Minute High-Yield Executive Summaries:** Core concepts and formulas for last-minute review.
- **15-Minute Complete Revision:** Deep chapter breakdowns.
- **3D Flip Flashcards:** Realistic 3D perspective flip with keyboard/touch navigation.

### 4. 🎯 MCQ Practice & Quiz Engine
- Live timer countdown.
- Interactive question navigation (Questions 1 through 5).
- Auto-scoring with scorecards, percentages, and performance breakdowns.
- In-depth explanations for every correct and incorrect answer.
- Saves quiz attempts to the student's MongoDB Atlas profile.

### 5. 📜 Previous Year Questions (PYQ) Archive
- Verified questions from CBSE Class 12, JEE Main, NEET, GATE CSE, and University exams.
- Live search by topic, formula, or keyword.
- Official marking schemes and verified step-by-step solutions with collapsible reveals.

### 6. ⏱️ Mock Test Simulator
- 15-minute exam simulation with 10 questions.
- Question navigation palette with status indicators (Answered, Flagged, Unvisited).
- Configurable negative marking (+4 correct, -1 incorrect).
- Performance analysis scorecard saved to the database.

### 7. 📊 Personalized Student Dashboard (`dashboard.html`)
- Displays real MongoDB Atlas telemetry:
  - Total Notes Created & Saved
  - Quizzes Completed & Average Accuracy %
  - Mock Tests Attempted
- Private Cloud Notes Vault with one-click Load, Edit, Download, and Delete.
- Recent quiz attempts and mock test score records.

### 8. 🛡️ Multi-Provider AI Cloud Architecture (Zero-Downtime)
Supports 6 AI providers with failover:
1. **Google Gemini 1.5 Flash** (`GEMINI_API_KEY`)
2. **Groq Cloud LLaMA 3.3 70B** (`GROQ_API_KEY`)
3. **OpenRouter Gemini 2.0 Flash** (`OPENROUTER_API_KEY`)
4. **Cerebras LLaMA 3.1 8B** (`CEREBRAS_API_KEY`)
5. **SambaNova Cloud LLaMA 3.1 8B** (`SAMBANOVA_API_KEY`)
6. **Hugging Face Inference** (`HUGGINGFACE_API_KEY`)
- **High-Yield Academic Fallback Engine:** Pre-compiled syllabus library for Physics, Chemistry, Biology, Mathematics, and Computer Science ensuring 100% uptime even if external AI keys are unavailable.

---

## 🏗️ Architecture & Technology Stack

```
project/
├── backend/
│   ├── models/
│   │   ├── User.js             # Student account schema (bcrypt hashed passwords)
│   │   ├── Note.js             # Saved academic notes schema
│   │   ├── QuizAttempt.js      # Student MCQ quiz attempts & scores
│   │   ├── MockTest.js         # Full-length exam simulation results
│   │   ├── Bookmark.js         # Student bookmarked questions & formulas
│   │   └── ApiUsageLog.js      # AI provider latency and telemetry logs
│   ├── services/
│   │   ├── aiService.js        # Multi-provider adapter with circuit-breaker & fallback
│   │   └── pyqData.js          # Verified PYQ repository with marking schemes
│   ├── .env                    # Active environment secrets (MongoDB Atlas URI, Port)
│   ├── .env.example            # Sample configuration reference
│   ├── package.json            # Dependencies: express, mongoose, bcryptjs, cors, dotenv
│   └── server.js               # Express application with RESTful APIs
├── backup_snapshot/            # Verified historical snapshot backup
├── index.html                  # Main Study Notes platform (Generator, Revision, MCQs, PYQs, Mocks)
├── dashboard.html              # Personalized student dashboard & cloud vault
├── login.html                  # Standalone student sign-in portal
├── register.html               # Standalone student registration portal
├── users.html                  # Live student directory table (admin verification)
├── style.css                   # Responsive stylesheet (Dark, Light, Eye-Comfort modes)
├── java.js                     # Client application script (ES6 vanilla JS)
├── .gitignore                  # Git exclusions
└── README.md                   # Platform documentation
```

---

## 💻 Setup & Run Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB Atlas**: Cluster URI configured in `backend/.env`

### 2. Installation & Running
Open your terminal in `C:\Users\DELL\Desktop\project\backend` and run:

```bash
# Start backend server
node server.js
```

The server will initialize on port **5000** and connect to MongoDB Atlas:
```
[STUDY NOTES SERVER] Running on port 5000 • Owner: Nikhil Tetarwal
[MONGODB] Connected Successfully to MongoDB Atlas (studynotes)!
```

### 3. Open in Browser
Visit in your web browser:
- **Main Platform:** `http://localhost:5000/index.html`
- **Student Dashboard:** `http://localhost:5000/dashboard.html`
- **Student Directory:** `http://localhost:5000/users.html`
- **Health Telemetry:** `http://localhost:5000/api/health`

---

## 🔒 Security & Data Integrity

- Passwords hashed using standard `bcryptjs` salt rounds before saving to MongoDB Atlas.
- No plain-text passwords or sensitive database credentials exposed to frontend clients.
- Existing user accounts (`nikh@gmail.com`, `lucky@gmail.com`, etc.) preserved in the `studynotes` database.
- Private Network Access (PNA) and CORS headers configured for local testing.
