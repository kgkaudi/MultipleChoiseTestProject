import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          QUIZMASTER
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="navbar-right desktop-only">
        {/* Theme Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>

        {!user && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        {user && (
          <>
            <span className="nav-user">Hello, {user.username}</span>

            <Link to="/profile" className="nav-link">Profile</Link>

            {user.role === "admin" && (
              <>
                <Link to="/admin" className="nav-link">Admin</Link>
                <Link to="/admin/users" className="nav-link">Users</Link>
                <Link to="/admin/questions" className="nav-link">Questions</Link>
              </>
            )}

            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      {/* Hamburger Icon */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {menuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <button
          className="mobile-close"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        {/* Mobile Theme Toggle */}
        <button
          className="mobile-theme-toggle"
          onClick={() => {
            toggleTheme();
            setMenuOpen(false);
          }}
        >
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        {!user && (
          <>
            <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="mobile-user">Hello, {user.username}</span>

            <Link
              to="/profile"
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            {user.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>

                <Link
                  to="/admin/users"
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Manage Users
                </Link>

                <Link
                  to="/admin/questions"
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Manage Questions
                </Link>
              </>
            )}

            <button className="mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
