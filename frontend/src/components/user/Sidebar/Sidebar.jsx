import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/user/sidebar.css";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="menu">
        <button onClick={() => navigate("/home")}>
          🏠 Home
        </button>

        <button onClick={() => navigate("/search")}>
          🔍 Explore
        </button>

        <button onClick={() => navigate("/messages")}>
          💬 Messages
        </button>

        <button onClick={() => navigate("/profile")}>
          👤 Profile
        </button>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;