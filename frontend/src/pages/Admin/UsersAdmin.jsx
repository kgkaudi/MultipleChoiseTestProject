import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin.css";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [quizSize, setQuizSize] = useState("");

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  const showPopup = (message) => {
    const popup = document.createElement("div");
    popup.className = "success-popup";
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 4000);
  };

  const toggleQuizAccess = async (id, currentState) => {
    const res = await api.put(`/users/${id}/toggle-quiz`, { canTakeQuiz: !currentState });
    setUsers(users.map(u => u._id === id ? { ...u, canTakeQuiz: res.data.canTakeQuiz } : u));

    showPopup(`User ${currentState ? "locked" : "unlocked"} successfully`);
  };

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`);
    setUsers(users.filter(u => u._id !== id));

    showPopup("User deleted successfully");
  };

  const updateQuizSizeForAll = async () => {
    if (!quizSize) {
      showPopup("Please enter a quiz size");
      return;
    }

    await api.put("/users/quiz-size", { quizSize: Number(quizSize) });

    showPopup(`Quiz size set to ${quizSize} for all users`);

    const res = await api.get("/users");
    setUsers(res.data);
  };

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Manage Users</h2>

      <div className="admin-form" style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Set quiz size for all users"
          value={quizSize}
          onChange={(e) => setQuizSize(e.target.value)}
        />
        <button className="admin-btn" onClick={updateQuizSizeForAll}>
          Update Quiz Size
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Score</th>
              <th>Can Take Quiz</th>
              <th>Quiz Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.lastScore}</td>
                <td>{u.canTakeQuiz ? "✅" : "❌"}</td>
                <td>{u.quizSize ?? "—"}</td>
                <td>
                  <button onClick={() => toggleQuizAccess(u._id, u.canTakeQuiz)}>
                    {u.canTakeQuiz ? "Lock" : "Unlock"}
                  </button>
                  <button onClick={() => deleteUser(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
