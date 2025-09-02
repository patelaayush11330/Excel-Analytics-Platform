import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import Profile from "../pages/Profile";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const profileBtnRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user?.role;
  const username = user?.name || "Profile";

  const handleLogout = async () => {
    setIsAnimating(true);
    try {
      await fetch("/auth/logout", { method: "POST", credentials: "include" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => navigate("/login"), 500);
    } catch (err) {
      console.error("Logout failed", err);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileBtnRef.current && !profileBtnRef.current.contains(e.target)) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [];

  if (role === "admin") {
    menuItems.push({ path: "/admin-dashboard", label: "Home", icon: "🛠️" });
  } else {
    menuItems.push({ path: "/dashboard", label: "Home", icon: "🏠" });
    menuItems.push({ path: "/upload", label: "Upload", icon: "📤" });
    menuItems.push({ path: "/history", label: "History", icon: "📊" });
  }

  return (
    <>
      {isOpen && (
        <div className="overlay-blur" onClick={() => setIsOpen(false)}>
          <div className="blur-effect"></div>
        </div>
      )}

      <div
        className={`navbar-toggle-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: "#fff", borderRadius: "6px", padding: "2px" }}
      >
        <div className="hamburger-lines">
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </div>
      </div>

      <nav className={`navbar vertical ${isOpen ? "open" : ""} ${isAnimating ? "animating" : ""}`}>
        <div className="navbar-content">
          <div className="navbar-top">
            <div className="navbar-logo">
              <span className="logo-icon">📊</span>
              <span className="logo-text"></span>
            </div>
          </div>

          <div className="navbar-links">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                <div className="nav-ripple"></div>
              </Link>
            ))}

            <span
              ref={profileBtnRef}
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              className={`nav-link profile-btn ${showProfilePopup ? "active" : ""}`}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">{username}</span>
              <div className="nav-ripple"></div>
            </span>

            <button
              onClick={handleLogout}
              className={`logout-btn ${isAnimating ? "loading" : ""}`}
              disabled={isAnimating}
            >
              <span className="nav-icon">
                {isAnimating ? <div className="logout-spinner"></div> : "🚪"}
              </span>
              <span className="nav-text">
                {isAnimating ? "Logging out..." : "Logout"}
              </span>
              <div className="nav-ripple"></div>
            </button>
          </div>

          <div className="navbar-footer">
            <div className="status-indicator">
              <div className="status-dot online"></div>
              <span className="status-text">Online</span>
            </div>
          </div>
        </div>
      </nav>

      {showProfilePopup && (
        <div className="profile-popup-wrapper">
          <div className="profile-popup-backdrop" onClick={() => setShowProfilePopup(false)} />
          <div className="profile-popup-content">
            <Profile onClose={() => setShowProfilePopup(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
