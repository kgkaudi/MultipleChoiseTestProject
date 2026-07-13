# 📘 **FRONTEND README.md (`frontend/README.md`)**

```md
# Frontend – Multiple Choice Quiz (React + Vite)

This is the frontend for the Multiple Choice Quiz platform.  
Built with **React**, **Vite**, **Context API**, and custom animations.

---

## 📁 Folder Structure

```
frontend/
  src/
    pages/
    components/
    context/
    api/
    styles/
```

---

## 🎨 UI Features

- Animated dashboard
- Admin dashboard
- Manage users
- Manage questions
- Gold popup notifications
- Responsive layout
- Slide-in animations

---

## 🔌 API Integration

All API calls are handled through:

```
src/api/api.js
```

Uses Axios with:
- Base URL
- Token injection
- Error handling

---

## 🔐 Authentication

Stored in:
```
src/context/AuthContext.jsx
```

Features:
- Login
- Register
- Auto-logout on token expiration
- User role support

---

## 🧪 Pages

### User Pages
- Dashboard
- Quiz
- Login
- Register

### Admin Pages
- Admin Dashboard
- Manage Users
- Manage Questions

---

## ▶️ Running the Frontend

### Install dependencies
```
npm install
```

### Start dev server
```
npm run dev
```

### Environment variables
Create `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Build for production

```
npm run build
```

---

## 📄 License

MIT License
```