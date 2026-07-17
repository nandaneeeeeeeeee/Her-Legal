<div align="center">

# ⚖️ her·legal

**Know your rights. Before life asks.**

[![Stack](https://img.shields.io/badge/Stack-MERN-000?style=flat-square&logo=react)](#)
[![AI](https://img.shields.io/badge/AI-Groq%20Llama%203.3-10b981?style=flat-square&logo=groq)](#)
[![Auth](https://img.shields.io/badge/Auth-JWT%20%7C%20Google%20%7C%20Magic%20Link-6366f1?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](#)

A full-stack platform making Nepali legal information accessible, understandable, and actionable for every woman — in **English** and **नेपाली**.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Design System](#-design-system)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Localization](#-localization)
- [Security](#-security)
- [License](#-license)

---

## 🌟 Overview

Her·Legal is a purpose-built legal technology platform for women in Nepal. It combines **AI-powered legal guidance**, **anonymous community support**, **document generation**, and **real-time emergency resources** — all free, private, and available in both English and Nepali.

### Core Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Accessible** | Web app works on any device, low bandwidth |
| **Anonymous** | Community posts, chat, and browsing require no identity |
| **Contextual** | AI responses grounded in Nepali constitution, acts, and case law |
| **Bilingual** | Full English/नेपाली support across every interface |
| **Private** | JWT rotation, no tracking, encrypted sessions |

---

## 🚀 Features

### 🤖 AI Legal Assistant — *Saathi*

| Capability | Detail |
|------------|--------|
| Real-time chat | Streaming responses via Groq Llama 3.3 70B |
| Context-aware | Remembers conversation history across sessions |
| Bilingual replies | Auto-detects English, Devanagari, or romanized Nepali and responds in kind |
| Structured answers | Headlines, bullet lists, relevant laws, articles, and next steps |
| Conversation management | Auto-title, rename, delete, persistent history |
| Action panel | Related laws, document templates, helpline contacts per response |
| Follow-up suggestions | AI-generated continuation prompts |
| Emergency detection | Identifies crisis keywords → instant helpline banner |
| File context | Upload documents/screenshots for AI-informed guidance |
| Voice input | Web Speech API microphone support |
| Text-to-speech | AI responses read aloud |

### 📄 Document Generation

| Document Type | Use Case |
|---------------|----------|
| Notice Letters | Workplace harassment, tenancy disputes, formal complaints |
| Legal Complaints | Domestic violence, property disputes, cyber crime |
| Affidavits | Sworn statements for court proceedings |
| Agreements | Mutual consent, settlement, tenancy contracts |
| Applications | Citizenship, passport, government scheme applications |
| Custom Letters | General legal correspondence |

Each document is generated in the selected language (EN/NE) with proper Nepali legal terminology and formatting.

### 👥 Anonymous Community

| Feature | Description |
|---------|-------------|
| Post creation | Share experiences, ask questions, seek advice |
| Anonymous identity | System-assigned pseudonyms (e.g., "Anonymous Lotus") |
| Reactions | Helpful, Supportive, Insightful — one-click engagement |
| Comments | Threaded replies with anonymous option |
| Save/bookmark | Bookmark posts for later reference |
| Categories | Women's Rights, Employment, Marriage, Property, Domestic Violence, Cyber Crime, Citizenship, Family Law |
| Moderation | AI-assisted content moderation with flag/report system |
| My Posts | Personal dashboard with edit/delete management |

### 📊 User Dashboard

| Widget | Description |
|--------|-------------|
| Stats overview | Real-time counts: conversations, documents, posts, bookmarks |
| Activity timeline | Chronological feed of all user actions |
| Quick actions | One-click access to AI, documents, community, glossary |
| My Posts management | Inline edit, delete, filter, category management |
| Settings hub | Profile, security, notification preferences |
| Rights & Resources | Curated legal tips on constitutional rights, acts, and free aid |

### 🔐 Authentication & Accounts

| Method | Details |
|--------|---------|
| Email + Password | Register, login, email verification, password reset |
| Google OAuth | One-click sign-in with Google |
| Magic Link | Passwordless email login |
| JWT Rotation | Access token (7d) + refresh token (15d) with automatic rotation |
| Session persistence | Remembered across browser sessions via localStorage |
| Profile management | Username, email, phone, avatar, language preference |

### 🌐 Localization

Every user-facing string exists in both English and Nepali. The language selector (visible pill in navbar) persists across sessions and applies to:

- All page content and navigation
- AI assistant responses
- Document generation output
- Community posts and comments
- Glossary terms and definitions
- Notification messages
- Dashboard labels and tooltips

### 🔔 Notifications

| Type | Trigger |
|------|---------|
| Reaction | Someone finds your community post helpful/supportive/insightful |
| Reply | Someone comments on your post |
| System | Account verification, password changes, platform announcements |

### 📚 Legal Glossary

69 terms covering key Nepali legal concepts — each with English term, Nepali term (नेपाली), Nepali definition, and category tags. Fully integrated with the language switcher.

### 🆘 Emergency Resources

One-tap access to:
- Nepal Police Women's Cell
- Women's Rights Organizations
- Free Legal Aid Centers
- Domestic Violence Hotlines
- Shelter and counseling services

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 7, Lucide React Icons |
| **Backend** | Express 5, Mongoose 9, JWT (jsonwebtoken), Bcrypt, Nodemailer |
| **Database** | MongoDB 7 (local or Atlas) |
| **AI/LLM** | Groq Cloud — `llama-3.3-70b-versatile` |
| **Auth** | Google OAuth 2.0, Magic Link (Nodemailer) |
| **Styling** | CSS custom properties, responsive grid, CSS modules |
| **APIs** | Web Speech API (voice input), Speech Synthesis (TTS), Web Share API |
| **Security** | Helmet, CORS, rate limiting, JWT rotation, bcrypt hashing |

---

## 🏗 Architecture

```
┌─────────────┐     HTTP/API      ┌──────────────┐     Mongoose     ┌──────────┐
│   Browser   │ ◄──────────────► │   Express    │ ◄──────────────► │ MongoDB  │
│  (React 19) │   5173 ◄──► 8000  │   Server     │                  │          │
└──────┬──────┘                   └──────┬───────┘                  └──────────┘
       │                                 │
       │ Vite Dev Proxy                  │ Groq API
       │ (/api → :8000)                  │ (LLM Inference)
       │                                 │
       │ LocalStorage                    │ Nodemailer
       │ (auth tokens,                   │ (Email, Magic Link)
       │  language pref)                 │
```

### Frontend Data Flow

1. **AuthContext** — wraps entire app, reads `herlegal_user` from localStorage on mount, exposes `user`, `login`, `logout`, `register`, `googleLogin`, `verifyMagicLink`, `updateUser`
2. **LanguageContext** — wraps entire app, reads `herlegal_language` from localStorage, exposes `t()` translation function and `setLanguage()`
3. **ChatbotContext** — manages AI chat widget open/close state
4. **API Client** (`client.js`) — centralized `fetch` wrapper with automatic auth header injection, 401 detection, token refresh, and error normalization

### Backend Request Lifecycle

```
Request → CORS → Helmet → Rate Limit → Router → Auth Middleware → Controller → Model → Response
                                                         │
                                                    JWT Verify
                                                    (User lookup)
```

---

## 📁 Project Structure

```
her-ligal/
├── src/                              # Backend (Express 5)
│   ├── controllers/                  # Route handlers
│   │   ├── auth.controller.js        # Register, login, logout, tokens
│   │   ├── chatbot.controller.js     # AI chat, conversation CRUD
│   │   ├── community.controller.js   # Posts, comments, reactions, reports
│   │   ├── confession.controller.js  # Anonymous confessions
│   │   ├── dashboard.controller.js   # Stats aggregation, activity feed
│   │   ├── document.controller.js    # Legal document generation
│   │   ├── notification.controller.js# User notifications CRUD
│   │   ├── oauth.controller.js       # Google OAuth callback
│   │   ├── settings.controller.js    # Profile, security, preferences
│   │   └── glossary.controller.js    # Legal terms CRUD
│   ├── models/                       # Mongoose schemas
│   │   ├── user.model.js             # Users with bcrypt & token
│   │   ├── conversation.model.js     # Chat threads with messages[]
│   │   ├── community.model.js        # Posts with comments[] & reactions
│   │   ├── document.model.js         # Generated legal documents
│   │   ├── notification.model.js     # User notifications
│   │   ├── confession.model.js       # Anonymous confessions
│   │   ├── chat.model.js             # Legacy flat chat
│   │   └── glossary.model.js         # Legal terms
│   ├── routes/                       # Express routers
│   │   ├── index.js                  # Route aggregator (/api/v1)
│   │   ├── auth.routes.js            # Auth endpoints
│   │   ├── chatbot.routes.js         # Chat + conversation endpoints
│   │   ├── community.routes.js       # Community CRUD + interactions
│   │   ├── dashboard.routes.js       # Dashboard data endpoints
│   │   ├── document.routes.js        # Document generation endpoints
│   │   ├── notification.routes.js    # Notification CRUD
│   │   ├── oauth.routes.js           # Google OAuth
│   │   ├── settings.routes.js        # Profile settings
│   │   ├── confession.routes.js      # Confession board
│   │   └── glossary.routes.js        # Glossary terms
│   ├── services/                     # Business logic
│   │   ├── auth.services.js          # Auth orchestration (register, login, tokens, reset)
│   │   ├── oauth.service.js          # Google OAuth token exchange
│   │   └── ai.service.js             # Groq LLM integration
│   ├── middlewares/
│   │   ├── auth.middleware.js         # JWT verification + role guard
│   │   └── errorHandler.js           # Global error handler
│   ├── config/
│   │   └── jwtConfig.js              # JWT secret & expiry config
│   ├── utils/
│   │   ├── ApiError.js               # Custom error class
│   │   ├── ApiResponse.js            # Standardized response builder
│   │   ├── asyncHandler.js           # Async error wrapper
│   │   └── mailHandeler.js           # Nodemailer transporter
│   ├── validators/                   # Joi validation schemas
│   ├── db/
│   │   └── index.js                  # MongoDB connection
│   ├── app.js                        # Express app setup (middleware, routes, errors)
│   └── index.js                      # Server entry point
│
├── frontend/                         # Frontend (React 19 + Vite 8)
│   └── src/
│       ├── pages/                    # 12 route pages
│       │   ├── Home.jsx/css          # Landing page (11 sections, editorial design)
│       │   ├── Chatbot.jsx/css       # AI assistant chat interface
│       │   ├── Community.jsx/css     # Anonymous community board
│       │   ├── Dashboard.jsx/css     # User dashboard with stats, activity, posts
│       │   ├── Confessions.jsx/css   # Confession board
│       │   ├── Documents.jsx/css     # Legal document generator
│       │   ├── Glossary.jsx/css      # Legal terms (EN/NE)
│       │   ├── Login.jsx/css         # Auth pages (login, signup, forgot, reset)
│       │   ├── Register.jsx/css      # Registration form
│       │   ├── ForgotPassword.jsx/css
│       │   ├── ResetPassword.jsx/css
│       │   └── NotFound.jsx          # 404 page
│       ├── components/               # Reusable UI components
│       │   ├── Navbar.jsx/css        # Responsive nav + language pill + profile menu
│       │   ├── Footer.jsx/css        # Site footer
│       │   ├── ProtectedRoute.jsx    # Auth guard wrapper
│       │   ├── AIChatWidget.jsx/css  # Floating AI chat bubble
│       │   └── EmergencyBanner.jsx   # Crisis helpline banner
│       ├── api/                      # API client modules
│       │   ├── client.js             # Centralized fetch with auth & refresh
│       │   ├── auth.js               # Auth endpoints
│       │   ├── community.js          # Community CRUD
│       │   ├── dashboard.js          # Dashboard stats & activity
│       │   ├── chatbot.js            # AI chat endpoints
│       │   └── documents.js          # Document endpoints
│       ├── contexts/
│       │   ├── AuthContext.jsx        # Auth state management
│       │   ├── LanguageContext.jsx    # i18n with full EN/NE translation maps
│       │   └── ChatbotContext.jsx     # Widget state
│       ├── App.jsx                   # Router, layout, context providers
│       ├── main.jsx                  # React entry point
│       └── index.css                 # Design tokens, global styles, font imports
│
├── public/
│   └── images/                       # Editorial Unsplash photos (10)
│
├── .env.example                      # Environment variable template
├── package.json                      # Backend dependencies & scripts
└── README.md
```

---

## 📡 API Reference

All endpoints are mounted under **`/api/v1`**. Authentication uses `Bearer <token>` in the `Authorization` header.

### 🔐 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Create account (username, email, password, phone) |
| POST | `/auth/verifyEmail` | — | Verify email with 6-digit code |
| POST | `/auth/login` | — | Sign in, returns access + refresh tokens |
| POST | `/auth/forgotPassword` | — | Send reset code to email |
| POST | `/auth/resetPassword` | — | Reset password with code |
| POST | `/auth/refreshToken` | — | Rotate access + refresh tokens |
| POST | `/auth/changePassword` | JWT | Update current password |
| POST | `/auth/logout` | JWT | Invalidate session, clear refresh token |
| GET | `/auth/validateToken` | JWT | Check token validity |
| POST | `/auth/google` | — | Google OAuth with ID token |
| POST | `/auth/magic-link/send` | — | Send magic link to email |
| GET | `/auth/magic-link/verify` | — | Verify magic link token |

### 🤖 Chatbot

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chatbot/chat` | JWT | Send message, get AI response (streaming) |
| POST | `/chatbot/conversations` | JWT | Create new conversation |
| GET | `/chatbot/conversations/:userId` | JWT | List all user conversations |
| GET | `/chatbot/conversation/:id` | JWT | Get conversation messages |
| PATCH | `/chatbot/conversation/:id` | JWT | Rename conversation |
| DELETE | `/chatbot/conversation/:id` | JWT | Delete conversation |

### 👥 Community

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/community` | — | List posts (sort: latest/trending/popular, filter: category) |
| GET | `/community/:id` | — | Get post with reactions & comment count |
| GET | `/community/:id/comments` | — | Get post comments |
| POST | `/community` | JWT | Create post (title, text, category, tags, isAnonymous) |
| PATCH | `/community/:id` | JWT | Update own post (title, text, category, tags) |
| DELETE | `/community/:id` | JWT | Delete own post |
| GET | `/community/my/posts` | JWT | List current user's posts |
| GET | `/community/my/saved` | JWT | List saved posts |
| POST | `/community/:id/react` | JWT | Toggle reaction (helpful/supportive/insightful) |
| POST | `/community/:id/save` | JWT | Toggle save/bookmark |
| POST | `/community/:id/report` | JWT | Report post for moderation |
| POST | `/community/:id/comments` | JWT | Add comment |
| DELETE | `/community/:id/comments/:commentId` | JWT | Delete own comment |

### 📊 Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/stats` | JWT | User stats (conversations, documents, posts, saved) |
| GET | `/dashboard/activity` | JWT | Recent activity feed (10 latest actions) |

### 📄 Documents

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/documents` | JWT | List user documents |
| POST | `/documents/generate` | JWT | Generate legal document |
| GET | `/documents/:id` | JWT | Get document details |

### 🔔 Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | JWT | List user notifications |
| PATCH | `/notifications/:id/read` | JWT | Mark notification as read |
| PATCH | `/notifications/read-all` | JWT | Mark all as read |

### ⚙️ Settings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/settings/profile` | JWT | Get profile |
| PUT | `/settings/profile` | JWT | Update profile |
| PUT | `/settings/security` | JWT | Update security settings |
| GET | `/settings/notifications` | JWT | Get notification preferences |
| PUT | `/settings/notifications` | JWT | Update notification preferences |

### 📖 Glossary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/glossary` | — | List all legal terms |
| GET | `/glossary/:id` | — | Get term details |

### 🙏 Confessions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/confessions` | — | List confessions |
| POST | `/confessions` | — | Create confession |
| POST | `/confessions/:id/reply` | — | Reply to confession |

---

## 🗄 Database Models

### User
```
{
  username: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed, select: false),
  phone: String,
  image: String (URL),
  role: String (enum: 'user' | 'admin', default: 'user'),
  isVerified: Boolean (default: false),
  verificationCode: String,
  verificationCodeExpiry: Date,
  forgotPasswordCode: String,
  forgotPasswordCodeExpiry: Date,
  refreshToken: String,
  language: String (enum: 'en' | 'ne', default: 'en')
}
```

### Conversation
```
{
  userId: ObjectId (ref: User),
  title: String (auto-generated from first message),
  messages: [{
    role: String (enum: 'user' | 'assistant'),
    content: String,
    timestamp: Date (default: now)
  }]
}
```

### Post (Community)
```
{
  userId: ObjectId (ref: User, required),
  title: String (required, max: 200),
  text: String (required, max: 10000),
  category: String (enum: 10 categories),
  tags: [String],
  isAnonymous: Boolean (default: true),
  anonymousIdentity: String (auto-assigned pseudonym),
  moderationStatus: String (enum: pending/approved/rejected),
  reactions: {
    helpful: [ObjectId],
    supportive: [ObjectId],
    insightful: [ObjectId]
  },
  comments: [{
    userId: ObjectId,
    author: String,
    text: String,
    isAnonymous: Boolean,
    helpfulCount: Number,
    helpfulBy: [ObjectId]
  }],
  viewCount: Number,
  saveCount: Number,
  commentCount: Number,
  savedBy: [ObjectId],
  isFlagged: Boolean,
  flagReason: String,
  flaggedBy: [ObjectId]
}
```

### Document
```
{
  userId: ObjectId (ref: User),
  title: String (required),
  type: String (enum: notice, complaint, affidavit, agreement, application, letter, other),
  content: String (generated document text),
  formData: Mixed (submission form data),
  version: Number (default: 1),
  previousVersions: [{ content, version, createdAt }]
}
```

### Notification
```
{
  userId: ObjectId (ref: User),
  type: String (enum: reaction, reply, system),
  title: String,
  message: String,
  link: String,
  isRead: Boolean (default: false)
}
```

### Confession
```
{
  userId: ObjectId (ref: User),
  text: String,
  isAnonymous: Boolean,
  replies: [{ author: String, text: String, createdAt: Date }]
}
```

### Glossary
```
{
  term: String (English term),
  nepaliTerm: String (नेपाली शब्द),
  definition: String (English definition),
  nepaliDefinition: String (नेपाली परिभाषा),
  category: String
}
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#C8102E` | Buttons, links, active states, accents |
| `--primary-hover` | `#B00E28` | Button hover states |
| `--primary-light` | `rgba(200,16,46,0.08)` | Subtle backgrounds, active nav items |
| `--primary-glow` | `rgba(200,16,46,0.15)` | Shadow glow on primary elements |
| `--accent` | `#F5B301` | Highlights, badges, notifications |
| `--bg` | `#FCFCFD` | Page background |
| `--bg-alt` | `#F3F4F6` | Alternate/section backgrounds |
| `--bg-card` | `#FFFFFF` | Card, modal, dropdown surfaces |
| `--border` | `#E5E7EB` | Borders, dividers, input outlines |
| `--text-heading` | `#030712` | Primary heading color |
| `--text` | `#111827` | Body text |
| `--text-muted` | `#6B7280` | Secondary, caption, placeholder text |
| `--success` | `#059669` | Positive states, verified badges |
| `--warning` | `#D97706` | Warning states, pending indicators |
| `--error` | `#DC2626` | Error states, validation |
| `--font-display` | `DM Serif Display` | Headings, display text |
| `--font-body` | `DM Sans`, `Noto Sans Devanagari` | Body, UI, nav text |

### Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| 1320px | Max content width |
| 1100px | Dashboard grid collapses |
| 900px | Sidebar overlays, hero stacks |
| 640px | Single-column layout |

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (tested on 24.x)
- **MongoDB** 7+ running locally (or Atlas URI)
- **Groq API key** — register at [groq.com](https://console.groq.com/keys)
- (Optional) **Gmail app password** for email features (verification, magic link, password reset)

### Installation

```bash
# 1. Clone
git clone <repo-url>
cd her-ligal

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend && npm install && cd ..

# 4. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, Groq key, JWT secret
```

### Environment Configuration

```env
MONGODB_URI=mongodb://127.0.0.1:27017/herlegal
GROQ_API_KEY=gsk_your_key_here
JWT_SECRET=your_random_64_char_secret
GMAIL_USER=your.email@gmail.com       # Optional
GMAIL_APP_PASS=your_16_char_app_pass   # Optional
PORT=8000
```

### Running

```bash
# Terminal 1 — Backend (port 8000)
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser. The Vite dev server proxies `/api` requests to the backend.

---

## 🔧 Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `MONGODB_URI` | Yes | `mongodb://127.0.0.1:27017/herlegal` | MongoDB connection string |
| `GROQ_API_KEY` | Yes | — | Groq Cloud API key for LLM inference |
| `JWT_SECRET` | Yes | — | Secret for signing JWT access & refresh tokens |
| `PORT` | No | `8000` | Backend server port |
| `GMAIL_USER` | No | — | Gmail address for Nodemailer SMTP |
| `GMAIL_APP_PASS` | No | — | Gmail app-specific password |
| `FRONTEND_URL` | No | `http://localhost:5173` | CORS origin |

If `GMAIL_USER` and `GMAIL_APP_PASS` are not set, accounts are auto-verified without sending an email.

---

## 📜 Scripts

### Backend (root `package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload on changes) |
| `npm start` | Production start with `node src/index.js` |
| `npm install` | Install/update backend dependencies |

### Frontend (`frontend/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint (ESLint-compatible) |

---

## 🌐 Localization

Her·Legal is fully bilingual. The language system works as follows:

### Translation Architecture

- **`LanguageContext.jsx`** holds two translation maps: `en` and `ne`
- Each map contains ~90+ keys covering all UI strings
- Language preference is persisted in both `localStorage("herlegal_language")` and user profile
- The `t()` function looks up the current language's map, falls back to English, then returns the key

### Language Detection

- AI assistant auto-detects input script and responds in kind
- Devanagari input → Nepali response
- Romanized Nepali → Romanized Nepali response
- English → English response

### Translation Coverage

| Area | Keys |
|------|------|
| Navigation & layout | 15 |
| Home page | 12 |
| AI Chat | 10 |
| Community | 8 |
| Dashboard | 14 |
| Auth pages | 12 |
| Documents | 6 |
| Glossary | 4 |
| Common (buttons, alerts) | 12 |
| **Total** | **~93** |

---

## 🔒 Security

| Measure | Implementation |
|---------|---------------|
| Password hashing | bcrypt with salt rounds |
| JWT rotation | Access token (7d) + refresh token (15d) |
| HTTP security headers | Helmet middleware |
| CORS | Restricted to `FRONTEND_URL` |
| Input validation | Joi schemas on all mutation endpoints |
| Error handling | Centralized error handler, no stack leaks |
| Session management | Refresh token stored in DB, revocable on logout |
| Anonymous posts | User IDs never exposed in community content |
| XSS protection | React's built-in escaping + Content-Type headers |

---

## 📄 License

ISC — see [LICENSE](LICENSE) (not included; backend `package.json` specifies ISC).

---

<div align="center">

Built with ❤️ for every woman in Nepal.

**Know your rights. Before life asks.**

</div>
