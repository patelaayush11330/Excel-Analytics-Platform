// Register.js


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/Auth.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("⚠️ Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        role,
      });
console.log("Full response", res);
console.log("res.data", res.data);

      const { token, user } = res.data;

      if (token && user?.role) {
  localStorage.setItem("token", token);
  localStorage.setItem("auth", "true");
  localStorage.setItem("role", user.role);
  toast.success("✅ Registration successful");
  setTimeout(() => navigate("/login"), 1500);
} else {
  toast.error("⚠️ Registration succeeded but token or role missing");
}


    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>

      <motion.div 
        className="auth-image-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/img.png" alt="Join Us" />
        <div className="welcome-text">
          <h2>Join Our Community!</h2>
          <p>Create your account and start your data analysis journey</p>
        </div>
      </motion.div>

      <motion.div
        className="auth-form-wrapper"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <form className="auth-form" onSubmit={handleRegister}>
          <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            Sign Up
          </motion.h2>

          <motion.div className="input-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <span className="input-icon">📧</span>
          </motion.div>

          <motion.div className="input-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className="input-icon">🔒</span>
          </motion.div>

          <motion.div className="input-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <span className="input-icon">🔐</span>
          </motion.div>

          <motion.div className="input-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option disabled value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <span className="input-icon">👤</span>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className={`auth-btn ${isLoading ? "loading" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <div className="loading-spinner"></div> : "Create Account"}
          </motion.button>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
            Already have an account? <a href="/login">Login</a>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
