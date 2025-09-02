// components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Add a brief delay to show loading animation
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1000);

    setShowAnimation(true);
    
    return () => clearTimeout(timer);
  }, []);

  const token = localStorage.getItem("token");

  if (isChecking) {
    return (
      <div className={`auth-loading ${showAnimation ? 'show' : ''}`}>
        <div className="auth-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="auth-content">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-dot"></div>
          </div>
          <h3>🔐 Securing Your Session</h3>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="protected-content">
      <div className="content-background">
        <div className="grid-pattern"></div>
        <div className="gradient-overlay"></div>
      </div>
      {children}
    </div>
  );
};

export default ProtectedRoute;

// Add this CSS to your global styles or create a separate CSS file
const styles = `
.auth-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.auth-loading.show {
  opacity: 1;
}

.auth-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: floatShapes 8s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 30%;
  left: 70%;
  animation-delay: 4s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  top: 10%;
  right: 10%;
  animation-delay: 6s;
}

.auth-content {
  text-align: center;
  color: white;
  z-index: 10;
  position: relative;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
}

.spinner-ring {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.5s ease-in-out infinite;
}

.auth-content h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.auth-content p {
  margin: 0;
  opacity: 0.8;
  font-size: 16px;
}

.protected-content {
  position: relative;
  min-height: 100vh;
}

.content-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(100, 181, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 181, 246, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

.gradient-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 30%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(156, 39, 176, 0.1) 0%, transparent 50%);
}

@keyframes floatShapes {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.7;
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}