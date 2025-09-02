import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminSummary = async () => {
      try {
        const token = localStorage.getItem("token"); // Assumes token is saved on login

        const res = await axios.get("http://localhost:5000/api/admin/overview", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Matches your verifyToken.js middleware
          },
        });

        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchAdminSummary();
  }, []);

  const getStatusClass = (status) => (status === "online" ? "online" : "offline");

  return (
    <div className="admin-dashboard">
      <h2>👑 Admin Dashboard</h2>

      <div className="admin-stats">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-box">
          <h3>Online Users</h3>
          <p>{users.filter((u) => u.status === "online").length}</p>
        </div>
        <div className="stat-box">
          <h3>Offline Users</h3>
          <p>{users.filter((u) => u.status === "offline").length}</p>
        </div>
      </div>

      <div className="user-table">
        <h3>📋 User Activity</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Total Files</th>
              <th>Worked Files</th>
              <th>Untouched Files</th>
            </tr>
          </thead>
          <tbody>
  {users.map((user, index) => (
    <tr
      key={index}
      className="clickable-row"
      onClick={() => navigate(`/admin/user-files/${user.userId}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{user.name || "N/A"}</td>
      <td>{user.email}</td>
      <td>
        <span className={`status-dot ${getStatusClass(user.status)}`}></span>
        {user.status}
      </td>
      <td>{user.totalFiles}</td>
      <td>{user.workedFiles.length}</td>
      <td>{user.untouchedFiles.length}</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
