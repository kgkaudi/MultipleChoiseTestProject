import { useLocation, Link } from "react-router-dom";
import "../styles/ResultsPage.css"

export default function ResultsPage() {
  const { state } = useLocation();
  const { questions, userAnswers, score } = state || {};

  if (!questions || !userAnswers)
    return <p>No results available. Please take the quiz first.</p>;

  return (
    <div className="results-container">
      <h2 className="results-title">Quiz Results</h2>

      <p className="results-score">
        Your Score: <span>{score}</span> / {questions.length}
      </p>

      <div className="results-list">
        {questions.map((q, i) => {
          const userAnswerIndex = userAnswers[i];
          const userAnswer = q.answers[userAnswerIndex];
          const correctAnswer = q.answers[q.correctIndex];
          const isCorrect = userAnswerIndex === q.correctIndex;

          return (
            <div
              key={i}
              className={`result-item ${isCorrect ? "correct" : "incorrect"}`}
            >
              <h3 className="result-question">{q.question}</h3>

              <p className="result-answer">
                <strong>Your answer:</strong>{" "}
                <span className={isCorrect ? "answer-correct" : "answer-wrong"}>
                  {userAnswer}
                </span>
              </p>

              {!isCorrect && (
                <p className="result-correct-answer">
                  <strong>Correct answer:</strong>{" "}
                  <span className="answer-correct">{correctAnswer}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="results-buttons">
        <Link to="/quiz">
          <button className="retry-btn">Try Again</button>
        </Link>
        <Link to="/">
          <button className="home-btn">Go Home</button>
        </Link>
      </div>
    </div>
  );
}
