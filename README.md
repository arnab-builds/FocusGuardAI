# FocusGuard AI

### AI-Powered Human Attention Preservation & Digital Distraction Intelligence Platform

FocusGuard AI is an AI-powered productivity platform that helps individuals and organizations monitor digital activity, identify distractions, analyze productivity, and improve focus.

It combines a **React web application, Django REST API, PostgreSQL database, AI services, and a Chrome Extension** for real-time browser activity tracking and automatic website categorization.

---

## ✨ Key Features

- 📊 Productivity dashboard & analytics
- 🌐 Real-time browser activity tracking
- 🤖 AI-powered recommendations & AI Coach
- 💬 AI chatbot with chat history
- 🧠 Automatic website categorization
- 🎯 Focus goals, streaks & productivity scoring
- 📑 Productivity reports & reminders
- 🏢 Employee & organization management
- 🔐 Role-based authentication (Employee, Organization Admin, Super Admin)
- 🌍 Multi-language support
- 🌙 Light / Dark Mode
- 🧩 Chrome Extension integration

---

## 🛠️ Tech Stack

**Frontend:** React, JavaScript, Vite, React Router, Context API, Tailwind CSS, Material UI, Recharts, Axios

**Backend:** Python, Django, Django REST Framework, PostgreSQL

**AI:** Google Gemini, Groq, Sarvam AI

**Extension:** JavaScript, Chrome Extension APIs

**Internationalization:** i18next, react-i18next

**Tools:** Git, GitHub, VS Code, Postman

---

## 🏗️ Architecture

```text
Chrome Extension
       ↓
React Frontend
       ↓
Django REST API
       ↓
PostgreSQL
       ↓
AI & Analytics
       ↓
Productivity Insights



🚀 Local Setup
Prerequisites
Python 3.12+
Node.js 20+
PostgreSQL
Google Chrome
Git
Backend
cd FocusGuard-Backend
python -m venv .venv

Windows:

.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

Backend:

http://127.0.0.1:8000

Frontend
cd FocusGuard-Frontend
npm install
npm run dev

Frontend:

http://localhost:3000

Chrome Extension
Open chrome://extensions
Enable Developer Mode
Click Load unpacked
Select FocusGuard-Extension
🔐 Environment Variables

Create:

FocusGuard-Backend/.env

Add your own database, email, and AI API credentials.

SECRET_KEY=your-secret-key


DB_NAME=focusguard
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=127.0.0.1
DB_PORT=5432


GROQ_API_KEY=your-key
GEMINI_RECOMMENDATION_API_KEY=your-key
GEMINI_CATEGORY_API_KEY=your-key

Never commit .env files or API keys.

👨‍💻 My Contribution

Worked on the development and integration of major parts of the platform, including:

React frontend & Django backend
REST API integration
Chrome Extension & activity tracking
Automatic website categorization
Productivity analytics
AI features & chatbot
Authentication and role-based access
Organization Admin & Super Admin modules
Internationalization
Responsive UI and Dark Mode
Testing, debugging and feature integration
📑 Presentation

View Project Presentation
