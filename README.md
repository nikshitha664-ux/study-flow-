# AI Workspace - Enterprise Multi-Tenant AI Platform

A full-stack, enterprise-ready multi-tenant AI productivity platform powered by **Node.js/Express**, **React (Vite + TypeScript)**, **PostgreSQL (Supabase RLS)**, and **Google Gemini 2.5 Flash**.

---

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion, React Markdown.
- **Backend:** Node.js (v20+), Express.js, TypeScript, Zod, Helmet, Cors, Express Rate Limit.
- **Database & Security:** Supabase PostgreSQL with Row Level Security (RLS), Supabase Auth.
- **AI Integration:** Official `@google/genai` SDK using `gemini-2.5-flash` model for streaming chat, document Q&A, and structured quiz generation.

---

## 🚀 Key Features

1. **AI Streaming Chat:** Real-time Server-Sent Events (SSE) chat with folder organizational hierarchy, pinned threads, markdown syntax highlighting, and copy options.
2. **Document & PDF Assistant:** Drag-and-drop document upload with text extraction, executive summarization, and interactive structured JSON quiz generation (`QuizViewer`).
3. **Rich Text AI Notes:** Note editor with inline floating action AI toolbar for rephrasing, expanding, and summarizing content.
4. **Code Assistant Studio:** Multi-language code editor supporting debug, generate, optimize, and explain modes across TypeScript, JavaScript, Python, SQL, Go, and Rust.
5. **Multi-Language Translation Engine:** Dual-pane translation interface across English, Hindi, Telugu, French, German, and Japanese.
6. **AI Image Studio:** Text-to-image studio with full-screen lightbox preview and asset download capabilities.
7. **Projects & Kanban Task Management:** Workspace creation, task assignment, due dates, priority tags, and Kanban drag-and-drop workflow updates.
8. **Settings & Custom API Keys:** Theme persistence switcher (Dark/Light mode) and custom Gemini API key override support.

---

## 📁 Repository Structure

```
.
├── schema.sql                   # Complete PostgreSQL DDL (Tables, Indexes, RLS Policies)
├── server/
│   ├── src/
│   │   ├── config/supabase.ts   # Supabase client initialization
│   │   ├── services/gemini.ts   # Google GenAI SDK configuration & Quiz Schema
│   │   ├── middleware/          # Auth verification & Zod payload validation
│   │   ├── routes/              # Express API endpoints (/api/v1/ai)
│   │   ├── controllers/         # Gemini SSE streaming & processing logic
│   │   └── index.ts             # Express server entry point
│   ├── package.json
│   └── tsconfig.json
└── client/
    ├── src/
    │   ├── components/          # Common UI, Chat, Documents, Notes, Projects, Layout
    │   ├── context/             # AuthContext & ThemeContext
    │   ├── pages/               # Dashboard, Chat, Documents, Notes, Code, Translator, ImageGen, Projects, Settings, Login
    │   ├── types/               # TypeScript interfaces
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## ⚙️ Running Locally

### 1. Database Setup
Execute `schema.sql` in your Supabase SQL Editor to initialize all 10 tables, indexes, and Row Level Security policies.

### 2. Backend Server Setup
```bash
cd server
cp .env.example .env
# Add GEMINI_API_KEY, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY to .env
npm install
npm run dev
```

### 3. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` to access the application.
