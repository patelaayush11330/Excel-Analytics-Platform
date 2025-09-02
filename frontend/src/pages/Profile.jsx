// Profile.js

import React, { useEffect, useState, useRef } from "react";
import "../styles/Profile.css";

const Profile = ({ onClose }) => {
  const popupRef = useRef(null);
  const [profile, setProfile] = useState({ email: "", role: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ send token here
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile({
            email: data.email || "unknown@example.com",
            role: data.role || "user",
          });
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="profile-popup" ref={popupRef}>
      <h4>👤 Profile</h4>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default Profile;

