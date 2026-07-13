import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/QuizPage.css";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.canTakeQuiz) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    api.get("/questions").then((res) => setQuestions(res.data));
  }, []);

  if (!questions.length) return <p>Loading...</p>;

  const q = questions[index];

  const handleAnswer = (i) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = i;

    setUserAnswers(updatedAnswers);

    if (i === q.correctIndex) {
      setScore((prev) => prev + 1);
    }

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      finishQuiz(updatedAnswers);
    }
  };

  const finishQuiz = async (finalAnswers = userAnswers) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const finalScore = finalAnswers.reduce((acc, answer, idx) => {
      return answer === questions[idx].correctIndex ? acc + 1 : acc;
    }, 0);

    // Update backend
    const res = await api.put(`/users/${user._id}/score`, { lastScore: finalScore });

    // Update context immediately with backend response
    setUser({
      ...user,
      lastScore: finalScore,
      canTakeQuiz: false,
      dateCompleted: new Date().toISOString()
    });

    navigate("/results", {
      state: { questions, userAnswers: finalAnswers, score: finalScore },
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
