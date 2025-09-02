import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">📊 Excel Analytics Platform</h1>
        <p className="landing-description">
          Turn your spreadsheets into stunning visual insights.<br />
          Upload Excel files, parse data, and visualize trends with just a few clicks.
        </p>

        <div className="landing-buttons">
          <button className="btn-login" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-register" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
