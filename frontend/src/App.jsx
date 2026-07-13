import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import ProtectedRoute from "./components/ProtectedRoute";
import Quiz from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import Navbar from "./components/Navbar";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddQuestion from "./pages/Admin/AddQuestion";
import UsersAdmin from "./pages/Admin/UsersAdmin";
import QuestionsAdmin from "./pages/Admin/QuestionsAdmin";

// ===============================
// Admin-only route protection
// ===============================
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <Dashboard />; // redirect non-admins to dashboard
  }

  return children;
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route path="/results" element={<ResultsPage />} />

        {/* ===============================
            ADMIN ROUTES (Protected)
        =============================== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersAdmin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <QuestionsAdmin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/questions/add"
          element={
            <AdminRoute>
              <AddQuestion />
            </AdminRoute>
          }
        />

      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
