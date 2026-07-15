---

# Multiple Choice Quiz Platform

A full‑stack multiple‑choice quiz platform featuring dynamic quizzes, admin controls, JWT authentication, and a fully theme‑aware React frontend.

---

## ✨ Overview

This project is a complete quiz system built for real‑world use:

- **React + Vite frontend** with Context API, custom animations, and full light/dark theme support  
- **Node.js + Express backend** with modular architecture  
- **MongoDB (Mongoose)** for persistent storage  
- **Admin dashboard** for managing users, questions, quiz size, and access  
- **Secure authentication** using JWT  
- **Automatic quiz locking**, score tracking, and user progress history  

---

## 🚀 Features

### 👤 User Features
- Register & login using **identifier** (email or username)  
- JWT‑based authentication  
- Take quizzes with dynamic question count  
- View last score, percentage, and completion date  
- Quiz auto‑locks after completion  
- Fully responsive UI with theme toggle (light/dark)

### 🛠 Admin Features
- Manage questions (create, update, delete)  
- Manage users (CRUD + access control)  
- Set global quiz size  
- Lock/unlock quiz access per user  
- View migration status & seeded data  
- Admin‑only dashboard with tables, filters, and actions

### 🎨 Frontend Features
- React (Vite) + Context API  
- Global theme system (CSS variables)  
- Smooth animations (fade, slide, stagger)  
- Responsive design for all pages  
- Clean component structure  
- Axios API layer  
- Protected routes

### ⚙️ Backend Architecture
- **Controllers** — HTTP request handling  
- **Services** — business logic  
- **Repositories** — database operations  
- **Models** — Mongoose schemas  
- **Routes** — clean, modular routing  
- **Middleware** — JWT auth, validation  
- **Migrations** — automatic admin/user/question seeding  

---

## 📦 Project Structure

```
project/
  backend/
    controllers/
    services/
    repositories/
    routes/
    models/
    middleware/
    utils/
    migrations/
  frontend/
    src/
      pages/
      components/
      context/
      styles/
      api/
      hooks/
```

---

## 🧪 Postman Collection

A complete Postman collection is included:

```
MultipleChoiceQuiz.postman_collection.json
```

Contains:
- Auth endpoints (register, login with `identifier`)  
- User management  
- Question CRUD (difficulty required, answers normalized to 4)  
- Admin tools  
- Migration checks  
- Quiz endpoints  

---

## 🛠 Requirements

- Node.js 18+  
- MongoDB (local or Atlas)  
- Vite  
- npm or yarn  

---

## ▶️ Running the Project

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend `.env`
```bash
MONGO_URI=
JWT_SECRET=
PORT=5000
```

### Frontend `.env`
```bash
VITE_API_URL=http://localhost:5000
```

---

## 🧩 API Notes

### Auth
- **Register:** `/api/auth/register`  
  - Body: `{ "username": "", "email": "", "password": "" }`
- **Login:** `/api/auth/login`  
  - Body: `{ "identifier": "", "password": "" }`

### Questions
- **Create Question:** requires `difficulty` and exactly 4 answers  
- **Update Question:** must include `difficulty` and valid `correctIndex`  
- **Validation:** automatic normalization of answers to 4 items

---

## 📄 License

MIT License

---