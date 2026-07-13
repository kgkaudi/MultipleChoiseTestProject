import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin.css"

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  const toggleQuizAccess = async (id, currentState) => {
    const res = await api.put(`/users/${id}/toggle-quiz`, { canTakeQuiz: !currentState });
    setUsers(users.map(u => u._id === id ? { ...u, canTakeQuiz: res.data.canTakeQuiz } : u));
  };

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Manage Users</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Score</th>
              <th>Can Take Quiz</th>
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
