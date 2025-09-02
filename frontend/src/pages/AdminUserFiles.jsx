import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/AdminUserFiles.css";

const AdminUserFiles = () => {
  const { userId } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/admin/user-files/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(res.data || []);
      } catch (err) {
        console.error("Error fetching user files:", err);
      }
    };

    fetchUserFiles();
  }, [userId]);

  return (
    <div className="user-files-page">
      <h2>📁 User File History</h2>
      <table className="file-table">
        <thead>
          <tr>
            <th>Original Name</th>
            <th>Mimetype</th>
            <th>Size (KB)</th>
            <th>Uploaded At</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id}>
              <td>{file.originalname}</td>
              <td>{file.mimetype}</td>
              <td>{(file.size / 1024).toFixed(2)}</td>
              <td>{new Date(file.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserFiles;
