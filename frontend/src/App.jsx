import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

function App() {
  const { user } = useContext(AuthContext);

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
