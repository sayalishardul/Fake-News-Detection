import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully!");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        📰 Fake News Detector
      </div>

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/profile">
          👤 Profile
        </Link>

      </div>

      <div className="navbar-right">

        <span className="welcome-user">
          Welcome, {user?.name}
        </span>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;