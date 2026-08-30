import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/user/sidebar.css";

import { useLoader } from "../../../context/LoaderContext";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import kiteBrandLogo from "../../../assets/logo/kite-brand-logo.png";

import {
  House,
  Compass,
  MessageCircle,
  Bell,
  Bookmark,
  UserRound,
  SquarePlus,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const { showLoader, hideLoader } = useLoader();

  const [active, setActive] = useState("Home");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNavigation = (name, path) => {
    setActive(name);
    navigate(path);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);

    showLoader();

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      hideLoader();
      navigate("/");
    }, 1200);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">

          {/* LOGO */}
          <div className="sidebar-logo">
            <img src={kiteBrandLogo} alt="KITE" />
          </div>

          <div className="sidebar-divider" />

          {/* MENU */}
          <nav className="menu">

            <button
              className={active === "Feed" ? "active" : ""}
              onClick={() => handleNavigation("Feed", "/home")}
            >
              <House size={21} strokeWidth={1.8} />
              <span>Feed</span>
            </button>


            {/* Discover */}
            <button
              className={active === "Discover" ? "active" : ""}
              onClick={() => handleNavigation("Discover", "/explore")}
            >
              <Compass size={21} strokeWidth={1.8} />
              <span>Discover</span>
            </button>


            <button
              className={active === "Connect" ? "active" : ""}
              onClick={() => handleNavigation("Connect", "/messages")}
            >
              <MessageCircle size={21} strokeWidth={1.8} />
              <span>Connect</span>
            </button>


            {/* Pulse */}
            <button
              className={active === "Pulse" ? "active" : ""}
              onClick={() => handleNavigation("Pulse", "/notification")}
            >
              <Bell size={21} strokeWidth={1.8} />
              <span>Pulse</span>
            </button>


            <button
              className={active === "Collections" ? "active" : ""}
              onClick={() => handleNavigation("Collections", "/saved")}
            >
              <Bookmark size={21} strokeWidth={1.8} />
              <span>Collections</span>
            </button>


            <button
              className={active === "Identity" ? "active" : ""}
              onClick={() => handleNavigation("Identity", "/profile")}
            >
              <UserRound size={21} strokeWidth={1.8} />
              <span>Identity</span>
            </button>


          </nav>
        </div>

        {/* BOTTOM */}
        <div className="sidebar-bottom">

          <div className="sidebar-divider" />

          {/* CREATE */}
          <div className="create-section">

            <nav className="menu">

              <button
                className={active === "Create" ? "active" : ""}
                onClick={() => handleNavigation("Create", "/create")}
              >
                <SquarePlus size={21} strokeWidth={1.8} />
                <span>Create</span>
              </button>

            </nav>

          </div>

          {/* SETTINGS */}
          <nav className="menu bottom-menu">

            <button
              onClick={() => navigate("/edit-profile")}
            >
              <Settings size={21} strokeWidth={1.8} />
              <span>Preferences</span>
            </button>

            <button
              onClick={() => {
                showLoader();

                setTimeout(() => {
                  hideLoader();
                  navigate("/support");
                }, 600);
              }}
            >
              <CircleHelp size={21} strokeWidth={1.8} />
              <span>Support</span>
            </button>

          </nav>

          {/* PROFILE */}
          <div className="profile-card">
            <img
              src={JSON.parse(localStorage.getItem("user"))?.avatar || "https://i.pravatar.cc/150"}
              alt="Profile"
            />

            <div className="profile-info">
              <div className="profile-name">
                {JSON.parse(localStorage.getItem("user"))?.username || "KITE User"}
              </div>

              <div className="profile-username">
                @{JSON.parse(localStorage.getItem("user"))?.username || "user"}
              </div>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            className="logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>

        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to Sign Out from KITE?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default Sidebar;