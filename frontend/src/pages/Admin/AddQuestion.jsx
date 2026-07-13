import { useState } from "react";
import api from "../../api/api";
import "../../styles/Admin.css";

export default function AddQuestion() {
  const [questionData, setQuestionData] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
    category: "",
    difficulty: "easy",
  });

  const handleChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };

  const handleAnswerChange = (i, value) => {
    const updated = [...questionData.answers];
    updated[i] = value;
    setQuestionData({ ...questionData, answers: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/questions", questionData);

      // Create success popup using CSS class
      const popup = document.createElement("div");
      popup.className = "success-popup";
      popup.textContent = "Question added successfully!";
      document.body.appendChild(popup);

      // Remove popup after 5 seconds and redirect
      setTimeout(() => {
        popup.remove();
        window.location.href = "/admin/questions";
      }, 5000);

      // Reset form
      setQuestionData({
        question: "",
        answers: ["", "", "", ""],
        correctIndex: 0,
        category: "",
        difficulty: "easy",
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Add New Question</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          name="question"
          placeholder="Question"
          value={questionData.question}
          onChange={handleChange}
        />
        {questionData.answers.map((a, i) => (
          <input
            key={i}
            placeholder={`Answer ${i + 1}`}
            value={a}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
          />
        ))}
        <input
          name="correctIndex"
          type="number"
          min="0"
          max="3"
          value={questionData.correctIndex}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category"
          value={questionData.category}
          onChange={handleChange}
        />
        <select
          name="difficulty"
          value={questionData.difficulty}
          onChange={handleChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button type="submit" className="admin-btn">Add Question</button>
      </form>
    </div>
  );
}
