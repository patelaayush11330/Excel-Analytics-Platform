// src/pages/AnalyzePage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import "../styles/AnalyzeFile.css";

function AnalyzePage() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const res = await axios.get(`/files/${fileId}`);
        setFileData(res.data.rows);
        setColumns(res.data.columns);
      } catch (error) {
        console.error("Failed to load file data", error);
      }
    };
    fetchFileData();
  }, [fileId]);

  const handleAnalyze = () => {
    navigate(`/analyze/${fileId}/charts`);
  };

  return (
    <div className="analyze-container">
      <h2>📄 Files Preview</h2>
      {fileData.length > 0 ? (
        <div className="table-container">
          <table className="excel-table">
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, i) => (
                    <td key={i}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button className="analyze-btn" onClick={handleAnalyze}>
            📊 Analyze This File
          </button>
        </div>
      ) : (
        <p>Loading file data...</p>
      )}
    </div>
  );
}

export default AnalyzePage;
