import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: "", // 👈 supports email or username
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData); // 👈 sends identifier + password
      setToken(res.data.token);
      setUser(res.data.user);
      navigate("/");
    } catch {
      alert("Invalid email/username or password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Welcome Back</h2>

        <div className="input-group fade-in">
          <input
            type="text"
            name="identifier"
            placeholder="EMAIL OR USERNAME"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group fade-in delay-1 password-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="login-btn fade-in delay-2">
          LOGIN
        </button>

        <p className="login-switch fade-in delay-3">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
