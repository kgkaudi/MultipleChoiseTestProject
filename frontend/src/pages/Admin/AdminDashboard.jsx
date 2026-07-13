import { Link } from "react-router-dom";
import "../../styles/Admin.css"

export default function AdminDashboard() {
  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Admin Panel</h2>
      <div className="admin-links">
        <Link to="/admin/users" className="admin-btn">Manage Users</Link>
        <Link to="/admin/questions" className="admin-btn">Manage Questions</Link>
      </div>
    </div>
  );
}
