import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 NEW

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className="register-title">Create your Account</h2>

        <div className="input-group fade-in">
          <input
            type="text"
            name="username"
            placeholder="NAME"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group fade-in delay-1">
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group fade-in delay-2 password-group">
          <input
            type={showPassword ? "text" : "password"} // 👈 toggle visibility
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

        <button type="submit" className="register-btn fade-in delay-3">
          SIGN UP
        </button>
      </form>
    </div>
  );
}
