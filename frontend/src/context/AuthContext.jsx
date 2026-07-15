import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const [token, setToken] = useState(localStorage.getItem("token"));

  /* ===========================
     THEME (light / dark)
  =========================== */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* Apply theme to <body> */
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--text", "#9ca3af");
      root.style.setProperty("--text-h", "#f3f4f6");
      root.style.setProperty("--bg", "#16171d");
      root.style.setProperty("--border", "#2e303a");
      root.style.setProperty("--code-bg", "#1f2028");
      root.style.setProperty("--accent", "#c084fc");
      root.style.setProperty("--accent-bg", "rgba(192, 132, 252, 0.15)");
      root.style.setProperty("--accent-border", "rgba(192, 132, 252, 0.5)");
      root.style.setProperty("--social-bg", "rgba(47, 48, 58, 0.5)");
    } else {
      root.style.setProperty("--text", "#6b6375");
      root.style.setProperty("--text-h", "#08060d");
      root.style.setProperty("--bg", "#fff");
      root.style.setProperty("--border", "#e5e4e7");
      root.style.setProperty("--code-bg", "#f4f3ec");
      root.style.setProperty("--accent", "#aa3bff");
      root.style.setProperty("--accent-bg", "rgba(170, 59, 255, 0.1)");
      root.style.setProperty("--accent-border", "rgba(170, 59, 255, 0.5)");
      root.style.setProperty("--social-bg", "rgba(244, 243, 236, 0.5)");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ===========================
     Persist token
  =========================== */
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /* ===========================
     Persist user
  =========================== */
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  /* ===========================
     Refresh user from backend
  =========================== */
  const refreshUser = async () => {
    try {
      if (!user || !user._id) return;

      const res = await api.get(`/users/${user._id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  /* ===========================
     Logout
  =========================== */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  /* ===========================
     Provide context
  =========================== */
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        refreshUser,

        // THEME
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
