# Multiple Choice Quiz Platform

A full‑stack multiple‑choice quiz application built with:

- **Frontend:** React (Vite), Context API, Tailwind/DaisyUI (optional), custom animations  
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT authentication  
- **Architecture:** Controllers → Services → Repositories  
- **Admin Tools:** Manage users, questions, quiz size, quiz access  
- **Features:** Dynamic quiz size, score tracking, admin dashboard, migrations

---

## 🚀 Features

### 👤 User Features
- Register & login with JWT authentication
- Take quizzes with dynamic question count
- View last score & completion date
- Quiz access locks automatically after completion

### 🛠 Admin Features
- Manage questions (CRUD)
- Manage users (CRUD)
- Toggle quiz access per user
- Set quiz size for all users
- View migration status

### ⚙️ Backend Architecture
- **Controllers:** Handle HTTP requests  
- **Services:** Business logic  
- **Repositories:** Database operations  
- **Models:** Mongoose schemas  
- **Routes:** Clean and declarative

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
    utils/
  frontend/
    src/
      pages/
      components/
      context/
      styles/
      api/
```

---

## 🧪 Postman Collection

A full Postman collection is included:

```
MultipleChoiceQuiz.postman_collection.json
```

Contains:
- Auth endpoints
- User endpoints
- Question endpoints
- Admin endpoints
- Migration check

---

## 🛠 Requirements

- Node.js 18+
- MongoDB (local or Atlas)
- Vite
- npm or yarn

---

## 📄 License

MIT License
```