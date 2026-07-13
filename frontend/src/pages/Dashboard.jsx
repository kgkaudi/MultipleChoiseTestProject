import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";


export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const totalQuestions = 20;
  const lastScore = user?.lastScore ?? 0;
  const percentage = ((lastScore / totalQuestions) * 100).toFixed(1);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-left slide-in-left">
        <h2 className="dashboard-title fade-in">Welcome</h2>

        {user ? (
          <>
            <p className="dashboard-text fade-in delay-1">
              Hello, {user.username}!
            </p>
            <p className="dashboard-text fade-in delay-2">
              Last Score: {lastScore} ({percentage}%)
            </p>

            <Link to="/quiz" className="dashboard-btn gold fade-in delay-3">
              Start Quiz
            </Link>
          </>
        ) : (
          <>
            <p className="dashboard-text fade-in delay-1">
              Please log in to start your quiz.
            </p>

            <Link to="/login" className="dashboard-btn gold fade-in delay-2">
              Login
            </Link>
          </>
        )}
      </div>

      <div className="dashboard-right slide-in-right">
        {user ? (
          <>
            <h3 className="dashboard-subtitle fade-in delay-1">
              Ready for another challenge?
            </h3>

            <Link to="/quiz" className="dashboard-btn dark fade-in delay-2">
              Begin
            </Link>
          </>
        ) : (
          <>
            <h3 className="dashboard-subtitle fade-in delay-1">
              Don’t have an account?
            </h3>

            <Link to="/register" className="dashboard-btn dark fade-in delay-2">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
