// Footer.js
import React, { useState, useEffect } from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentYear(new Date().getFullYear());
    }, 60000); // Update year every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className={`footer ${isVisible ? 'footer-visible' : ''}`}>
      <div className="footer-content">
        <div className="footer-animation">
          <div className="floating-elements">
            <span className="floating-icon">📊</span>
            <span className="floating-icon">📈</span>
            <span className="floating-icon">💼</span>
          </div>
        </div>
        
        <div className="footer-text">
          <p>&copy; {currentYear} Excel Analytics. All rights reserved.</p>
          <div className="footer-tagline">
            <span className="tagline-text">Transforming all Data into Insights</span>
          </div>
        </div>
        
        <div className="footer-pulse"></div>
      </div>
    </footer>
  );
};

export default Footer;