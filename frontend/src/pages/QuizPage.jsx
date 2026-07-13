import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/QuizPage.css"

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/questions").then((res) => setQuestions(res.data));
  }, []);

  if (!questions.length) return <p>Loading...</p>;

  const q = questions[index];

  const handleAnswer = (i) => {
    setUserAnswers([...userAnswers, i]); // track user choice
    if (i === q.correctIndex) setScore(score + 1);
    if (index + 1 < questions.length) setIndex(index + 1);
    else finishQuiz();
  };

  const finishQuiz = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    await api.put(`/users/${user._id}/score`, { lastScore: score });

    // navigate to results page with quiz data
    navigate("/results", {
      state: { questions, userAnswers, score },
    });
  };

  return (
    <div className="quiz-container">
      <h2>{q.question}</h2>
      {q.answers.map((a, i) => (
        <button key={i} onClick={() => handleAnswer(i)}>
          {a}
        </button>
      ))}
    </div>
  );
}
