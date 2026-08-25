# FocusGuard AI

### AI-Powered Human Attention Preservation & Digital Distraction Intelligence Platform

**Turn digital activity into actionable productivity insights.**

FocusGuard AI is an intelligent productivity platform that helps individuals and organizations **understand digital behavior, identify distractions, measure productivity, and build better focus habits**.

Powered by **AI, real-time browser activity tracking, automatic website categorization, and role-based analytics**, FocusGuard AI transforms everyday digital activity into meaningful insights through a modern web platform and Chrome Extension.

---

## ✨ Key Features

- 📊 **Productivity Analytics** - Activity tracking, productivity scores, focus goals & reports
- 🧠 **AI Intelligence** - Website categorization, AI recommendations, AI Coach & chatbot
- 🏢 **Role-Based Management** - Employee, Organization Admin & Super Admin dashboards
- 🌐 **Chrome Extension** - Real-time browser tracking and automatic activity synchronization
- 🌍 **Multilingual Support** - Fast multi-language interface with translation fallback
- 🌙 **Modern UI** - Responsive design with Light / Dark Mode
- 🔐 **Secure Authentication**- Role-based access control and account management


## 👥 User Roles

FocusGuard AI provides role-based access for three major user types:

### 👤 Employee / Normal User

Provides personal productivity tracking and focus-management features.

### 🏢 Organization Admin

Manages employees and monitors productivity at the organization level.

### 👑 Super Admin

Manages organizations, users, and system-level administration.

Each role has its own dashboard and permissions.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React, JavaScript, Vite, React Router, Context API, Tailwind CSS, Material UI, Recharts, Axios |
| **Backend** | Python, Django, Django REST Framework, PostgreSQL |
| **AI & Translation** | Google Gemini, Groq, Sarvam AI |
| **Chrome Extension** | JavaScript, Chrome Extension APIs |
| **Internationalization** | i18next, react-i18next |
| **Development Tools** | Git, GitHub, VS Code, Postman |

---
## 🏗️ Architecture

FocusGuard AI follows a modular architecture that connects browser activity tracking, the web application, backend services, database, analytics, and AI features.

### System Flow

**Chrome Extension**  
↓  
**React Frontend**  
↓  
**Django REST API**  
↓  
**PostgreSQL Database**  
↓  
**AI & Analytics Services**  
↓  
**Productivity Insights & Reports**

### Architecture Components

| Component | Responsibility |
|---|---|
| 🧩 **Chrome Extension** | Captures browser activity and communicates tracking data with the backend. |
| ⚛️ **React Frontend** | Provides dashboards, analytics, AI features, settings, and role-based interfaces. |
| 🐍 **Django REST API** | Handles authentication, business logic, API requests, activity processing, and system communication. |
| 🗄️ **PostgreSQL** | Stores users, organizations, activities, goals, analytics, and application data. |
| 🤖 **AI & Analytics** | Handles website categorization, productivity analysis, recommendations, and intelligent features. |
| 📊 **Insights & Reports** | Presents productivity scores, trends, activity analytics, reports, and personalized recommendations. |

### Data Flow

**Browser Activity → Extension → REST API → Database & Processing → Analytics / AI → Dashboard**

---

## 🚀 Local Setup

### Prerequisites

Before running FocusGuard AI locally, make sure the following are installed:

- Python 3.12+
- Node.js 20+
- npm
- PostgreSQL
- Google Chrome
- Git

---

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd FocusGuard-Backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

#### Windows

Activate the virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
python manage.py migrate
```

Create a Django superuser:

```bash
python manage.py createsuperuser
```

Start the backend server:

```bash
python manage.py runserver
```

Backend:

`http://127.0.0.1:8000`

API:

`http://127.0.0.1:8000/api`

---

### 2. Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd FocusGuard-Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

`http://localhost:3000`

---

### 3. Chrome Extension Setup

The FocusGuard AI Chrome Extension is responsible for browser activity tracking and automatic website categorization.

#### Start the Application

Before loading the extension, make sure both the backend and frontend are running.

**Backend:**

```bash
cd FocusGuard-Backend
python manage.py runserver
```

**Frontend:**

```bash
cd FocusGuard-Frontend
npm run dev
```

#### Load the Extension

1. Open **Google Chrome**.
2. Navigate to:

   `chrome://extensions`

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Navigate to the cloned FocusGuard AI project.
6. Select the:

   `FocusGuard-Extension`

   folder.
7. The FocusGuard AI extension will now appear in Chrome.
8. Pin the extension to the Chrome toolbar for easy access.

#### Extension Usage

1. Click the **FocusGuard AI** extension and sign in.
2. Enable tracking.
3. Use **Go to Dashboard** to access your productivity dashboard.
4. Browse websites to verify activity tracking, categorization, and productivity analysis.

> **Note:** Keep the Django backend and React frontend running during local development.

---

## 🔐 Environment Variables

The backend requires environment variables for database access, email services, and AI integrations.

Create the following file:

`FocusGuard-Backend/.env`

Use your own local credentials and API keys:

```env
SECRET_KEY=generate-a-new-django-secret

DB_NAME=focusguard
DB_USER=postgres
DB_PASSWORD=your-local-postgres-password
DB_HOST=127.0.0.1
DB_PORT=5432

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-email-app-password
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=your-email@example.com

GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=your-groq-model

GEMINI_RECOMMENDATION_API_KEY=your-gemini-api-key
GEMINI_CATEGORY_API_KEY=your-gemini-api-key

CHATBOT_GEMINI_API_KEY=your-gemini-api-key
CHATBOT_GROQ_API_KEY=your-groq-api-key

FOCUS_PLAN_GEMINI_API_KEY=your-gemini-api-key
FOCUS_PLAN_GROQ_API_KEY=your-groq-api-key

SARVAM_API_KEY=your-sarvam-api-key
```

> **Never commit `.env` files, API keys, passwords, or authentication tokens to GitHub.**

---


---



---

## 🧪 Verification

After completing the setup, verify the following:

### Backend

```bash
python manage.py check
```

### Frontend

```bash
npm run build
```

If the project has linting configured:

```bash
npm run lint
```


## 👤 Author

**Arnab**


GitHub: [arnab-builds](https://github.com/arnab-builds)
