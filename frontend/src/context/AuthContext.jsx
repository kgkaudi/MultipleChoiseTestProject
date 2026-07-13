import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const [token, setToken] = useState(localStorage.getItem("token"));

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
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
