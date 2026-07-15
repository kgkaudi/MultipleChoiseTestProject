---

# Backend – Multiple Choice Quiz API

The backend powering the Multiple Choice Quiz Platform.  
Built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and a clean layered architecture:

```
Controller → Service → Repository → Model
```

Provides authentication, quiz logic, admin tools, migrations, and a fully modular API.

---

## 📁 Folder Structure

```
backend/
  controllers/     # HTTP request handlers
  services/        # Business logic
  repositories/    # Database operations
  routes/          # API routing
  models/          # Mongoose schemas
  middleware/      # JWT auth, admin guard
  migrations/      # Automatic seeding
  utils/           # Helpers (hashing, tokens)
  tests/           # Jest unit + integration tests
```

---

## 🔐 Authentication

- JWT‑based authentication  
- Secure password hashing (bcrypt)  
- Admin role support  
- Token expiration: **24 hours**  
- Login uses **identifier** (email or username)

### Endpoints
```
POST /api/auth/register
POST /api/auth/login
```

### Login Body
```json
{
  "identifier": "email-or-username",
  "password": "yourPassword"
}
```

Explore more about authentication flow.

---

## 🧱 Architecture Overview

### **Controllers**
Handle HTTP requests and responses only.

### **Services**
Contain business logic:
- Registering users  
- Validating credentials  
- Updating scores  
- Locking/unlocking quiz access  
- Setting global quiz size  
- Question CRUD logic  
- Passing update options (`runValidators`, `context: "query"`)  

### **Repositories**
Abstract database operations:
- `findById`
- `findAll`
- `create`
- `updateById`
- `deleteById`
- `updateMany`

### **Models**
Mongoose schemas for:
- **User**  
- **Question** (answers normalized to 4, difficulty required)  
- **Migration** (tracks seeding status)

---

## 📌 API Endpoints

### **Auth**
```
POST /api/auth/register
POST /api/auth/login
```

### **Users**
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
PUT    /api/users/:id/score
PUT    /api/users/:id/toggle-quiz
PUT    /api/users/quiz-size
DELETE /api/users/:id
```

### **Questions**
```
GET    /api/questions
GET    /api/questions/:id
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

### **Migration**
```
GET /api/migration/status
```

Explore question validation rules.

---

## 🧪 Testing

The backend includes a complete Jest test suite:

- Controllers  
- Services  
- Repositories  
- Middleware  
- Routes  
- Integration tests  

All tests run with:

```
npm test
```

Learn more about backend testing strategy.

---

## 🧪 Postman Collection

Import:

```
MultipleChoiceQuiz.postman_collection.json
```

Includes:
- Auth (identifier login)  
- Users  
- Questions (difficulty required, answers normalized)  
- Admin tools  
- Migration check  

Explore Postman usage.

---

## ▶️ Running the Backend

### Install dependencies
```
npm install
```

### Start development server
```
npm run dev
```

---

## 🔧 Environment Variables

Create `.env`:

```
MONGO_URI=mongodb://localhost:27017/quiz
JWT_SECRET=yourSecretKey
PORT=5000
```

Supports both **local MongoDB** and **MongoDB Atlas**.

---

## 🛡 Middleware

- JWT authentication  
- Role‑based admin protection  
- Request validation  
- Error handling  

Explore middleware flow.

---

## 🧩 Migrations

Automatic seeding includes:

- Admin user  
- Sample questions  
- Migration status tracking  

Check migration status:

```
GET /api/migration/status
```

Explore migration system.

---

## 📄 License

MIT License

---