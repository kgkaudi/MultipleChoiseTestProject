import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin.css";
import { Link } from "react-router-dom";

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
    category: "",
    difficulty: "easy"
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    api.get("/questions").then((res) => setQuestions(res.data));
  }, []);

  const deleteQuestion = async (id) => {
    await api.delete(`/questions/${id}`);
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditing((prev) => ({
      ...prev,
      [name]: name === "correctIndex" ? Number(value) : value
    }));
  };

  const handleEditAnswerChange = (i, value) => {
    const updated = [...editing.answers];
    updated[i] = value;
    setEditing((prev) => ({ ...prev, answers: updated }));
  };

  const saveEdit = async () => {
    try {
      const res = await api.put(`/questions/${editing._id}`, editing);
      setQuestions((prev) =>
        prev.map((q) => (q._id === editing._id ? res.data : q))
      );
      setEditing(null);
    } catch (err) {
      console.error("Error updating question:", err);
    }
  };

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Manage Questions</h2>

      <Link to="/admin/questions/add" className="admin-btn">
        Add New Question
      </Link>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q._id}>
                <td>{q.question}</td>
                <td>{q.category}</td>
                <td>{q.difficulty}</td>
                <td>
                  <button onClick={() => setEditing(q)}>Edit</button>
                  <button onClick={() => deleteQuestion(q._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===========================
          EDIT MODAL
      ============================ */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Question</h3>

            <label>Question</label>
            <input
              name="question"
              value={editing.question}
              onChange={handleEditChange}
            />

            <label>Category</label>
            <input
              name="category"
              value={editing.category}
              onChange={handleEditChange}
            />

            <label>Difficulty</label>
            <select
              name="difficulty"
              value={editing.difficulty}
              onChange={handleEditChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <label>Answers</label>
            {editing.answers.map((ans, i) => (
              <input
                key={i}
                value={ans}
                onChange={(e) => handleEditAnswerChange(i, e.target.value)}
              />
            ))}

            <label>Correct Index</label>
            <input
              type="number"
              name="correctIndex"
              value={editing.correctIndex}
              onChange={handleEditChange}
              min="0"
              max={editing.answers.length - 1}
            />

            <div className="modal-actions">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
