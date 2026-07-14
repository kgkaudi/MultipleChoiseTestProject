import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    repeat: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    repeat: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    api.get("/users/me")
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChangePassword = async () => {
    setMessage({ type: "", text: "" });

    if (passwords.new !== passwords.repeat) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    try {
      await api.put("/users/change-password", {
        current: passwords.current,
        new: passwords.new,
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({ current: "", new: "", repeat: "" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to update password",
      });
    }
  };

  const toggleVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2 className="profile-title">Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Quiz Size:</strong> {user.quizSize}</p>

        <h3 className="profile-subtitle">Change Password</h3>
        <div className="profile-inputs">
          {["current", "new", "repeat"].map((field, index) => (
            <div key={index} className="password-field">
              <input
                type={showPassword[field] ? "text" : "password"}
                placeholder={
                  field === "current"
                    ? "Current password"
                    : field === "new"
                    ? "New password"
                    : "Repeat new password"
                }
                value={passwords[field]}
                onChange={e => setPasswords({ ...passwords, [field]: e.target.value })}
              />
              <span
                className="toggle-password"
                onClick={() => toggleVisibility(field)}
              >
                {showPassword[field] ? "Hide" : "Show"}
              </span>
            </div>
          ))}

          {message.text && (
            <p className={`profile-message ${message.type}`}>
              {message.text}
            </p>
          )}

          <button onClick={handleChangePassword}>Update Password</button>
        </div>
      </div>
    </div>
  );
}