<div align="center">

# her **legal**

**Know your rights. *Before life asks.***

[![Stack](https://img.shields.io/badge/Stack-Express%20%7C%20React%20%7C%20MongoDB-000?style=flat-square)](#)
[![AI](https://img.shields.io/badge/AI-Groq%20Llama%203.3-10b981?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](#)

Making legal information accessible, understandable, and actionable for every woman in Nepal.

</div>

---

## Overview

Her Legal is a full-stack platform that helps women in Nepal understand their legal rights through:

- **AI-powered legal assistant** (Saathi) — instant answers on property, marriage, employment, domestic violence, and more
- **Anonymous community** — share stories and support each other
- **Emergency resources** — one-tap helpline access
- **Knowledge hub** — articles and guides on Nepali law

Every feature is free, anonymous, and built specifically for Nepali legal context.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 7, Lucide Icons |
| **Backend** | Express 5, Mongoose 9, JWT auth, Nodemailer |
| **Database** | MongoDB (local or Atlas) |
| **AI** | Groq Cloud — `llama-3.3-70b-versatile` |
| **APIs** | Web Speech (voice input), Speech Synthesis (TTS), Web Share |

---

## Features

### AI Legal Assistant
- Real-time chat with **Saathi** — context-aware legal guidance
- Auto-title conversations, rename/delete history
- Structured answers with headlines, bullet lists, and source chips
- Follow-up suggestions and action panel (related laws, documents, contacts)
- Emergency detection with instant helpline banner

### Anonymous Community
- Share experiences on the Confessions board
- Reply to others — completely anonymous
- Safe, moderated environment

### Auth & Accounts
- Register / Login with email + password
- JWT-based sessions with access + refresh token rotation
- Email verification and password reset flow
- Persistent conversations across sessions

### Accessibility
- Voice input via Web Speech API
- Text-to-speech for AI responses
- File upload for document context
- Mobile-responsive design

---

## Project Structure

```
her-ligal/
├── src/                          # Backend (Express)
│   ├── controllers/              # Route handlers
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API route definitions
│   ├── services/                 # Business logic
│   ├── middlewares/              # Auth, validation, error handling
│   ├── config/                   # JWT config
│   ├── utils/                    # ApiError, ApiResponse, mailer
│   ├── validators/               # Joi schemas
│   ├── db/                       # MongoDB connection
│   ├── app.js                    # Express setup
│   └── index.js                  # Entry point
│
├── frontend/                     # Frontend (React + Vite)
│   └── src/
│       ├── pages/                # Route pages (8)
│       ├── components/           # Reusable UI (6)
│       ├── AuthContext.jsx       # Auth state management
│       ├── ChatbotContext.jsx    # Widget state
│       ├── index.css             # Design tokens & base styles
│       └── App.jsx               # Router & layout
│
├── .env.example                  # Environment template
└── package.json                  # Backend deps & scripts
```

---

## API Endpoints

All routes are mounted under `/api/v1`.

### Auth `/api/v1/auth`

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | — | Create account |
| POST | `/verifyEmail` | — | Verify email with code |
| POST | `/login` | — | Sign in, get tokens |
| POST | `/forgotPassword` | — | Request reset code |
| POST | `/resetPassword` | — | Reset with code |
| POST | `/refreshToken` | — | Rotate tokens |
| POST | `/changePassword` | JWT | Update password |
| POST | `/logout` | JWT | Invalidate session |
| GET | `/validateToken` | JWT | Check token validity |

### Chatbot `/api/v1/chatbot`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/chat` | Send message to AI |
| POST | `/conversations` | Create conversation |
| GET | `/conversations/:userId` | List conversations |
| GET | `/conversation/:id` | Get messages |
| PATCH | `/conversation/:id` | Rename conversation |
| DELETE | `/conversation/:id` | Delete conversation |

### Confessions `/api/v1/confessions`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | List all posts |
| POST | `/` | Create a post |
| POST | `/:id/reply` | Reply to a post |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally (or a cloud URI)
- **Groq API key** — get one at [groq.com](https://groq.com)
- (Optional) **Gmail app password** for email features

### 1. Clone and install

```bash
git clone <repo-url>
cd her-ligal

# Backend
npm install

# Frontend
cd frontend && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/herlegal
GROQ_API_KEY=gsk_...
JWT_SECRET=your_random_secret_here
GMAIL_USER=your@gmail.com       # optional — email features
GMAIL_APP_PASS=your_app_pass    # optional — email features
PORT=8000
```

### 3. Start the app

```bash
# Terminal 1 — Backend (port 8000)
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `MONGODB_URI` | Yes | `mongodb://127.0.0.1:27017/herlegal` | Database connection |
| `GROQ_API_KEY` | Yes | — | LLM inference API key |
| `JWT_SECRET` | Yes | — | Token signing secret |
| `GMAIL_USER` | No | — | SMTP sender address |
| `GMAIL_APP_PASS` | No | — | SMTP app password |
| `PORT` | No | `8000` | Server port |

If email credentials are not set, user accounts are auto-verified without sending an email.

---

## Database Models

### User
`username`, `email`, `password` (bcrypt), `phone`, `role` (user|admin), `refreshToken`, verification fields, password-reset fields.

### Conversation
`userId`, `title` (auto-generated), `messages[]` — embedded array with `{role, content}` subdocuments.

### Chat (legacy)
Flat chat history: `userId`, `message`, `response`, `isAnonymous`.

### Confession
`userId`, `text`, `isAnonymous`, `replies[]` — embedded array with `{author, text}` subdocuments.

---

## Scripts

### Backend (root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon auto-reload |
| `npm start` | Production start |
| `npm install` | Install dependencies |

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Oxlint |

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#C8102E` | Buttons, links, accents |
| `--accent` | `#F5B301` | Highlights, badges |
| `--bg` | `#FCFCFD` | Page background |
| `--bg-card` | `#FFFFFF` | Card surfaces |
| `--border` | `#E5E7EB` | Borders, dividers |
| `--text-heading` | `#030712` | Headings |
| `--text-muted` | `#6B7280` | Secondary text |
| `--font-display` | DM Serif Display | Headings |
| `--font-body` | DM Sans | Body text |

---

## License

ISC — see [LICENSE](LICENSE) (not included; backend `package.json` specifies ISC).

---

<div align="center">

Built with ❤️ for every woman in Nepal.

</div>
