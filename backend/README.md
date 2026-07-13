# Backend – Multiple Choice Quiz API

This is the backend for the Multiple Choice Quiz platform.  
Built with **Node.js**, **Express**, **MongoDB**, and a clean layered architecture:

```
Controller → Service → Repository → Model
```

---

## 📁 Folder Structure

```
backend/
  controllers/
  services/
  repositories/
  routes/
  models/
  utils/
```

---

## 🔐 Authentication

- JWT-based authentication
- `/api/auth/register`
- `/api/auth/login`
- Token expires in **1 day**
- Admin role supported

---

## 🧱 Architecture Overview

### Controllers
Handle HTTP requests only.

### Services
Contain business logic:
- Hashing passwords
- Validating credentials
- Updating scores
- Locking quiz access
- Setting quiz size

### Repositories
Handle database operations:
- `findById`
- `findAll`
- `create`
- `updateById`
- `deleteById`
- `updateMany`

### Models
Mongoose schemas for:
- User
- Question
- Migration

---

## 📌 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Users
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PUT    /api/users/:id/score
PUT    /api/users/:id/toggle-quiz
PUT    /api/users/quiz-size
DELETE /api/users/:id
```

### Questions
```
GET    /api/questions
GET    /api/questions/:id
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

### Migration
```
GET /api/migration/status
```

---

## 🧪 Postman Collection

Import:

```
MultipleChoiceQuiz.postman_collection.json
```

Includes:
- Auth
- Users
- Questions
- Admin tools
- Migration

---

## ▶️ Running the Backend

### Install dependencies
```
npm install
```

### Start server
```
npm run dev
```

### Environment variables
Create `.env`:

```
MONGO_URI=mongodb://localhost:27017/quiz
JWT_SECRET=yourSecretKey
PORT=5000
```

---

## 🛡 Middleware

- JWT authentication
- Role-based admin protection (optional)

---

## 📄 License

MIT License
```