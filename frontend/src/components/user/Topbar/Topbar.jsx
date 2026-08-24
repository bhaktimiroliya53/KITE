import React, { useState, useEffect } from "react";
import { Search, Plus, Bell, Moon } from "lucide-react";
import "../../../styles/user/topbar.css";
import kiteLogo from "../../../assets/logo/kite-icon.png";

const Topbar = ({ user }) => {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <header className={`topbar ${scrolled ? "scrolled" : ""}`}>

      {/* Search */}
      <div className="topbar-search">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search people, posts..."
        />

      </div>


      {/* KITE Logo */}
      <div className="topbar-logo">

        <img
          src={kiteLogo}
          alt="KITE"
        />

      </div>


      {/* Actions */}
      <div className="topbar-actions">


        <button className="topbar-action">
          <Plus size={22} />
        </button>


        <button className="topbar-action">
          <Bell size={21} />
        </button>


        <button className="topbar-action">
          <Moon size={21} />
        </button>



        {/* Profile */}

        <div className="topbar-profile">

          <img
            src={
              user?.avatar ||
              user?.profilePic ||
              user?.profileImage ||
              "https://i.pravatar.cc/150"
            }
            alt="Profile"
          />

        </div>


      </div>


    </header>
  );
};

export default Topbar;