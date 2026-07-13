import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Quiz.css";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    api.get("/questions").then((res) => setQuestions(res.data));
  }, []);

  if (!questions.length) return <p className="loading">Loading quiz...</p>;

  const q = questions[index];

  const handleAnswer = (i) => {
    if (i === q.correctIndex) setScore(score + 1);

    // Trigger exit animation
    setAnimate(false);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex(index + 1);
        setAnimate(true); // Trigger enter animation
      } else {
        finishQuiz();
      }
    }, 400);
  };

  const finishQuiz = () => {
    navigate("/results", {
        state: {
        score,
        total: questions.length
        }
    });
  };


  return (
    <div className="quiz-wrapper">
      <div className={`quiz-card ${animate ? "slide-in" : "slide-out"}`}>
        <h2 className="quiz-question fade-in">{q.question}</h2>

        <div className="answers">
          {q.answers.map((a, i) => (
            <button
              key={i}
              className={`answer-btn fade-in delay-${i}`}
              onClick={() => handleAnswer(i)}
            >
              {a}
            </button>
          ))}
        </div>

        <p className="progress fade-in delay-3">
          Question {index + 1} / {questions.length}
        </p>
      </div>
    </div>
  );
}
