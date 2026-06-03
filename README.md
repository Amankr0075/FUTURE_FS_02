<<<<<<< HEAD
# LeadFlow CRM 🚀

> A modern, full-stack Client Lead Management System (Mini CRM) built for managing, tracking, and converting leads — portfolio-ready and production-grade.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://mongodb.com/atlas)

---

## 📸 Screenshots

> _Add screenshots of your live deployment here._

| Dashboard | Leads Table | Analytics |
|-----------|-------------|-----------|
| ![Dashboard]() | ![Leads]() | ![Analytics]() |

---

## ✨ Features

### Authentication
- 🔐 Secure JWT-based authentication
- 🔑 bcrypt password hashing
- 🛡️ Protected routes & unauthorized access prevention
- 💾 Persistent login via localStorage
- ⏰ Auto-logout on token expiration

### Lead Management
- ➕ Create, Read, Update, Delete leads
- 🔍 Search by name, email, company
- 🎯 Filter by status, source, date range
- 📄 Pagination & sortable table columns
- 📤 CSV export

### Follow-Up Notes
- 📝 Add, edit, delete notes per lead
- 🕐 Timeline view, newest first
- 👤 Author and timestamp tracking

### Analytics
- 📊 Interactive charts (Line, Bar, Pie)
- 📈 Monthly growth trends
- 🎯 Conversion rate tracking
- 🏆 Most effective lead source analysis

### UI/UX
- 🌙 Dark mode with system preference detection
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Glassmorphism design system
- ⚡ Smooth animations and transitions
- 🔔 Toast notifications

### Bonus
- 📤 CSV export functionality
- 📋 Activity log per lead
- 👤 Profile management
- ⚙️ Settings page

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Notifications** | react-hot-toast |
| **Frontend Deploy** | GitHub Pages + GitHub Actions |
| **Backend Deploy** | Render |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/leadflow-crm.git
cd leadflow-crm
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```
Server will start at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd client
cp .env.example .env
# .env already points to localhost:5000/api for local dev
npm install
npm run dev
```
App will open at `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/leadflow
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://your-api.onrender.com/api`

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register admin | No |
| POST | `/auth/login` | Login | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/profile` | Update profile | Yes |
| PUT | `/auth/password` | Change password | Yes |

### Leads
| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/leads` | Get all leads | `search`, `status`, `source`, `startDate`, `endDate`, `page`, `limit`, `sort` |
| GET | `/leads/:id` | Get single lead | — |
| POST | `/leads` | Create lead | — |
| PUT | `/leads/:id` | Update lead | — |
| DELETE | `/leads/:id` | Delete lead | — |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads/:id/notes` | Get all notes |
| POST | `/leads/:id/notes` | Add note |
| PUT | `/leads/:id/notes/:noteId` | Update note |
| DELETE | `/leads/:id/notes/:noteId` | Delete note |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics` | Get aggregated analytics |

---

## 📦 Deployment

### Frontend → GitHub Pages

1. In `client/vite.config.js`, set `base: '/your-repo-name/'` if deploying to a GitHub Pages sub-path
2. Add `VITE_API_URL` secret in your GitHub repo: Settings → Secrets → Actions
3. Push to `main` branch — the GitHub Actions workflow will auto-deploy

### Backend → Render

1. Connect your GitHub repository to Render
2. Use the `render.yaml` configuration (Render will auto-detect it)
3. Add environment variables in Render dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your GitHub Pages URL)
4. Enable auto-deploy from the `main` branch

### Database → MongoDB Atlas

1. Create a cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add your IP (or `0.0.0.0/0` for Render) to the IP whitelist
3. Create a database user and copy the connection string to `MONGO_URI`

---

## 📁 Folder Structure

```
leadflow-crm/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── LeadForm.jsx
│   │   │   ├── NoteTimeline.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── hooks/
│   │   │   ├── useLeads.js
│   │   │   └── useDarkMode.js
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── LeadDetail.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── NotFound.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js           # Axios instance + interceptors
│   │   │   └── index.js         # Service wrappers
│   │   ├── utils/
│   │   │   └── helpers.js       # Formatters, constants, CSV export
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                     # Node.js Backend
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── leadController.js   # Includes notes logic
    │   └── analyticsController.js
    ├── middleware/
    │   └── auth.js             # JWT verify middleware
    ├── models/
    │   ├── User.js
    │   └── Lead.js             # Includes embedded Note schema
    ├── routes/
    │   ├── authRoutes.js
    │   ├── leadRoutes.js
    │   └── analyticsRoutes.js
    ├── .env.example
    ├── app.js                  # Express app setup
    └── server.js               # Entry point
```

---

## 🔮 Future Improvements

- [ ] Email notifications via SendGrid/Nodemailer
- [ ] Lead assignment to team members
- [ ] Kanban board view
- [ ] Custom fields per lead
- [ ] Two-factor authentication (2FA)
- [ ] Webhooks for external integrations
- [ ] Mobile app (React Native)
- [ ] Role-based access control (RBAC)
- [ ] Bulk import leads via CSV
- [ ] AI-powered lead scoring

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-profile)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> Built with ❤️ as an internship project — LeadFlow CRM
=======
# FUTURE_FS_02
>>>>>>> 3fa160ce21fc3a2508b911e85a042c73d91bcc5c
