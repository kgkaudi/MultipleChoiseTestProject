import { useState, useEffect } from "react";
import api from "../api/api"
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    repeat: "",
  });

  useEffect(() => {
    api
      .get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChangePassword = async () => {
    console.log(passwords)

    if (passwords.new !== passwords.repeat) {
      alert("New passwords do not match!");
      return;
    }
    
    try {
      await api.put(
        "/api/users/change-password",
        {
          current: passwords.current,
          new: passwords.new,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Password updated successfully!");
      setPasswords({ current: "", new: "", repeat: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update password");
    }
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
          <input
            type="password"
            placeholder="Current password"
            value={passwords.current}
            onChange={e => setPasswords({ ...passwords, current: e.target.value })}
          />
          <input
            type="password"
            placeholder="New password"
            value={passwords.new}
            onChange={e => setPasswords({ ...passwords, new: e.target.value })}
          />
          <input
            type="password"
            placeholder="Repeat new password"
            value={passwords.repeat}
            onChange={e => setPasswords({ ...passwords, repeat: e.target.value })}
          />
          <button onClick={handleChangePassword}>Update Password</button>
        </div>
      </div>
    </div>
  );
}
