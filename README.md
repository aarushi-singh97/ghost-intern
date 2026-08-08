# 👻 Ghost Intern

**Ghost Intern** is an AI-powered GitHub repository intelligence platform that helps developers quickly understand unfamiliar codebases.

Instead of manually exploring hundreds of files, Ghost Intern analyzes a GitHub repository and provides AI-generated insights about its structure, technologies, important files, and overall architecture.

---

## 🚀 Features

- 🔗 Analyze public GitHub repositories using a repository URL
- 📂 Explore repository structure and important files
- 🤖 AI-powered codebase analysis using Google Gemini
- 🧠 Generate easy-to-understand repository summaries
- ⚡ Fast backend API built with FastAPI
- 💻 Modern and responsive frontend interface
- 🔍 Helps developers understand unfamiliar projects faster

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion

### Backend
- Python
- FastAPI
- Uvicorn

### AI
- Google Gemini API

### Development Tools
- Git
- GitHub
- VS Code

---

## ⚙️ How It Works

1. The user enters a GitHub repository URL.
2. Ghost Intern retrieves information about the repository.
3. The backend processes the repository structure and relevant files.
4. Repository data is sent to the Gemini API for analysis.
5. AI-generated insights are returned to the frontend.
6. The user receives a simplified explanation of the codebase.

---

## 📁 Project Structure

```text
ghost-intern/
│
├── frontend/        # React frontend
├── backend/         # FastAPI backend
├── README.md
└── .gitignore 
