import { useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../styles/Results.css";

export default function Results({ score, total, user }) {
  useEffect(() => {
    if (user) {
      api.put(`/users/${user._id}/score`, {
        lastScore: score,
        dateCompleted: new Date()
      });
    }
  }, [user, score]);

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="results-wrapper">
      <div className="results-card slide-in">

        <div className="results-icon fade-in">
          🎉
        </div>

        <h2 className="results-title fade-in delay-1">
          Quiz Completed!
        </h2>

        <p className="results-score fade-in delay-2">
          You scored <span>{score}</span> out of <span>{total}</span>
        </p>

        <p className="results-percentage fade-in delay-3">
          {percentage}% correct
        </p>

        <div className="results-buttons fade-in delay-4">
          <Link to="/" className="results-btn gold">Dashboard</Link>
          <Link to="/quiz" className="results-btn dark">Try Again</Link>
        </div>

      </div>
    </div>
  );
}
