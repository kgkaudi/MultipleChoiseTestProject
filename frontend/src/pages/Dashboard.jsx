import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, refreshUser } = useContext(AuthContext);

  const totalQuestions = user?.quizSize ?? 10;
  const lastScore = user?.lastScore ?? 0;
  const percentage = ((lastScore / totalQuestions) * 100).toFixed(1);

  useEffect(() => {
    refreshUser();
  }, []);

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

            {/* Admin-only section */}
            {user.role === "admin" && (
              <div className="admin-section fade-in delay-4">
                <h3 className="dashboard-subtitle">Admin Tools</h3>
                <div className="admin-links">
                  <Link to="/admin" className="dashboard-btn dark">Admin Dashboard</Link>
                  <Link to="/admin/users" className="dashboard-btn dark">Manage Users</Link>
                  <Link to="/admin/questions" className="dashboard-btn dark">Manage Questions</Link>
                </div>
              </div>
            )}
            
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

            {user.canTakeQuiz ? (
              <Link to="/quiz" className="dashboard-btn dark fade-in delay-2">
                Begin
              </Link>
            ) : (
              <p className="dashboard-text fade-in delay-2 low">
                Quiz access is locked. Contact an admin to retake the test.
              </p>
            )}
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
