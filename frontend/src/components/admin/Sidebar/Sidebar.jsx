import { useState } from "react";
import "../../../styles/admin/Sidebar.css";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import kiteBrandLogo from "../../../assets/logo/kite-brand-logo.png";

function Sidebar({ onNavigate }) {
  const [active, setActive] = useState("Dashboard");

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

        <button className="logout-button">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;