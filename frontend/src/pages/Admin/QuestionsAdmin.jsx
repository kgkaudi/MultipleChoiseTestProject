import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin.css"

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

      <div className="admin-form">
        <input name="question" placeholder="Question" value={newQuestion.question} onChange={handleChange} />
        {newQuestion.answers.map((a, i) => (
          <input key={i} placeholder={`Answer ${i + 1}`} value={a} onChange={(e) => handleAnswerChange(i, e.target.value)} />
        ))}
        <input name="correctIndex" type="number" min="0" max="3" value={newQuestion.correctIndex} onChange={handleChange} />
        <input name="category" placeholder="Category" value={newQuestion.category} onChange={handleChange} />
        <select name="difficulty" value={newQuestion.difficulty} onChange={handleChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={createQuestion}>Add Question</button>
      </div>

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
