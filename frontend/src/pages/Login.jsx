import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLocked, setIsLocked] = useState(true); // Toggle lock icon only
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("auth", "true");
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLockIcon = () => {
    setIsLocked(!isLocked);
  };

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>

      {/* Left Image Section */}
      <motion.div 
        className="auth-image-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/img.png" alt="Welcome" />
        <div className="welcome-text">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your data analysis journey</p>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        className="auth-form-wrapper"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <form className="auth-form" onSubmit={handleLogin}>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Login
          </motion.h2>

          {/* Email Input */}
          <motion.div 
            className="input-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="input-icon">📧</span>
          </motion.div>

         {/* Password Input with Lock Toggle */}
<motion.div 
  className="input-group password-group"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
>
  <input
    type={isLocked ? "password" : "text"}  // <-- ✅ change here
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <span 
    className="input-icon lock-icon" 
    onClick={() => setIsLocked(!isLocked)}
    title="Toggle password visibility"
  >
    {isLocked ? "🔒" : "🔓"}
  </span>
</motion.div>


          {/* Submit Button */}
          <motion.button 
            type="submit" 
            disabled={isLoading}
            className={`auth-btn ${isLoading ? 'loading' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Login"
            )}
          </motion.button>

          {/* Register Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            You don't have an account? <a href="/register">Register</a>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
