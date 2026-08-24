import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/admin/Sidebar.css";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import Loader from "../../common/Loader/Loader";
import kiteBrandLogo from "../../../assets/logo/kite-brand-logo.png";

function Sidebar({ onNavigate }) {
  const navigate = useNavigate();

  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }, 1500);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <img
          src={kiteBrandLogo}
          alt="KITE"
          className="sidebar-logo"
        />

        <span>ADMIN PANEL</span>
      </div>

      <div className="sidebar-menu">
        {[
          { icon: <LayoutDashboard size={19} />, name: "Dashboard" },
          { icon: <Users size={19} />, name: "Users" },
          { icon: <FileText size={19} />, name: "Posts" },
          { icon: <BarChart3 size={19} />, name: "Analytics" },
          { icon: <Settings size={19} />, name: "Settings" },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActive(item.name);
              onNavigate(item.name.toLowerCase());
            }}
            className={`sidebar-btn ${
              active === item.name ? "active" : ""
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="admin-info">
          <h4>👤 Admin</h4>
          <p>🟢 Online</p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;