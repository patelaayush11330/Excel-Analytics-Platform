// History.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/History.css";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chart-history");
      const data = res.data || [];
      console.log("Fetched chart history:", data); // 🔍 Debug log
      setHistoryData(data);
      setFilteredData(data);
      localStorage.setItem("chartCount", data.length); // Store in localStorage for dashboard
    } catch (err) {
      console.error("❌ Error fetching chart history:", err);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = historyData.filter((item) =>
      [
        item.chartType,
        item.dimension,
        item.xAxis,
        item.yAxis,
        item.zAxis,
        item.fileId?.originalname || item.fileId?.filename || "", // fallback support
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
  }, [searchTerm, historyData]);

  return (
    <div className="history-page">
      <div className="history-header">
  <span>📊</span>
  <h1>Chart Generation History</h1>
</div>


      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by chart type, axis, or file name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="history-table">
        {filteredData.length === 0 ? (
          <p>No chart history found.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Chart Type</th>
                  <th>Dimension</th>
                  <th>X Axis</th>
                  <th>Y Axis</th>
                  <th>Z Axis</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      {entry.fileId?.originalname ||
                        entry.fileId?.filename ||
                        "N/A"}
                    </td>
                    <td>{entry.chartType || "-"}</td>
                    <td>{entry.dimension || "-"}</td>
                    <td>{entry.xAxis || "-"}</td>
                    <td>{entry.yAxis || "-"}</td>
                    <td>{entry.zAxis || "-"}</td>
                    <td>
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="row-count">Total Charts: {filteredData.length}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
