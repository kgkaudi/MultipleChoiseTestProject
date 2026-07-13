import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin.css"
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

  useEffect(() => {
    api.get("/questions").then((res) => setQuestions(res.data));
  }, []);

  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleAnswerChange = (i, value) => {
    const updated = [...newQuestion.answers];
    updated[i] = value;
    setNewQuestion({ ...newQuestion, answers: updated });
  };

  const createQuestion = async () => {
    const res = await api.post("/questions", newQuestion);
    setQuestions([...questions, res.data]);
    setNewQuestion({ question: "", answers: ["", "", "", ""], correctIndex: 0, category: "", difficulty: "easy" });
  };

  const deleteQuestion = async (id) => {
    await api.delete(`/questions/${id}`);
    setQuestions(questions.filter(q => q._id !== id));
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
            {questions.map(q => (
              <tr key={q._id}>
                <td>{q.question}</td>
                <td>{q.category}</td>
                <td>{q.difficulty}</td>
                <td>
                  <button onClick={() => deleteQuestion(q._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
