import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo/kite-brand-logo.png";
import "../../../styles/user/topbar.css";

function Topbar({ user }) {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="menu-icon">☰</div>

      <div className="center-logo">
        <img src={logo} alt="KITE" />
      </div>

      <div className="top-icons">
        <img
          src={user?.avatar || "https://i.pravatar.cc/150"}
          alt="profile"
          className="top-profile"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default Topbar;