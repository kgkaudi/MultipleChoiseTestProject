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
    const { name, value } = e.target;
    setQuestionData((prev) => ({
      ...prev,
      [name]: name === "correctIndex" ? Number(value) : value,
    }));
  };

  const handleAnswerChange = (i, value) => {
    const updated = [...questionData.answers];
    updated[i] = value;
    setQuestionData((prev) => ({ ...prev, answers: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { question, answers, correctIndex, category } = questionData;

    // ✅ Frontend validation
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    if (answers.some((a) => !a.trim())) {
      alert("Please fill all answer fields.");
      return;
    }

    if (category.trim() === "") {
      alert("Please enter a category.");
      return;
    }

    if (correctIndex < 0 || correctIndex >= answers.length) {
      alert("Correct index must match one of the answers.");
      return;
    }

    try {
      const payload = {
        ...questionData,
        correctIndex: Number(correctIndex),
      };

      await api.post("/questions", payload);

      // ✅ Success popup
      const popup = document.createElement("div");
      popup.className = "success-popup";
      popup.textContent = "Question added successfully!";
      document.body.appendChild(popup);

      setTimeout(() => {
        popup.remove();
        window.location.href = "/admin/questions";
      }, 5000);

      // ✅ Reset form
      setQuestionData({
        question: "",
        answers: ["", "", "", ""],
        correctIndex: 0,
        category: "",
        difficulty: "easy",
      });
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please check your inputs.");
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
          max={questionData.answers.length - 1}
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

        <button type="submit" className="admin-btn">
          Add Question
        </button>
      </form>
    </div>
  );
}
