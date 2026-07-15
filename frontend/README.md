---

# Frontend – Multiple Choice Quiz (React + Vite)

The frontend for the Multiple Choice Quiz Platform.  
Built with **React**, **Vite**, **Context API**, custom animations, and a fully theme‑aware UI using CSS variables.

---

## 📁 Folder Structure

```
frontend/
  src/
    pages/        # All user & admin pages
    components/   # Reusable UI components
    context/      # Auth + Theme context providers
    api/          # Axios API layer
    styles/       # Theme-aware CSS files
    hooks/        # Custom hooks
```

Explore the folder structure.

---

## 🎨 UI & UX Features

- Full **light/dark theme system** (CSS variables)  
- Smooth animations (fade, slide, stagger)  
- Responsive layout for all pages  
- Animated quiz interactions  
- Gold success popups  
- Mobile-friendly navbar + hamburger menu  
- Admin dashboard with tables & controls  
- Consistent design system across all pages  

Learn more about the theme system.

---

## 🔌 API Integration

All API calls are handled through:

```
src/api/api.js
```

Features:
- Axios instance with base URL  
- Automatic JWT injection  
- Global error handling  
- Protected routes  
- Support for backend’s **identifier-based login**  
- Automatic quiz locking and score updates  

Explore the API layer.

---

## 🔐 Authentication

Authentication logic lives in:

```
src/context/AuthContext.jsx
```

Includes:
- Login using **identifier** (email or username)  
- Register  
- JWT storage in localStorage  
- Auto-logout on expiration  
- Role-based UI (admin/user)  
- Theme persistence  

Learn more about AuthContext.

---

## 🧪 Pages

### User Pages
- Dashboard  
- Quiz  
- Results  
- Login  
- Register  
- Profile  

### Admin Pages
- Admin Dashboard  
- Manage Users  
- Manage Questions  
- Quiz Size Control  

Explore the page system.

---

## 🎨 Theme System

The entire frontend uses a **CSS variable theme engine** defined in:

```
src/index.css
```

Supports:
- Light mode  
- Dark mode  
- Accent colors  
- Code backgrounds  
- Smooth transitions  

Theme toggling is handled in:

```
src/context/ThemeContext.jsx
```

Learn more about ThemeContext.

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

## 📦 Build for Production

```
npm run build
```

---

## 📄 License

MIT License

---