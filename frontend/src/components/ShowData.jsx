import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ShowData.css";

const ChartPage = () => {
  const { fileId } = useParams();
  const [fileList, setFileList] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(fileId || "");
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataStats, setDataStats] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (fileId && isValidMongoId(fileId)) {
      setSelectedFileId(fileId);
      fetchParsedFileData(fileId);
    }
  }, [fileId]);

  const isValidMongoId = (id) => /^[a-f\d]{24}$/i.test(id);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/files");
      setFileList(res.data);
    } catch (err) {
      console.error("Failed to fetch file list:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParsedFileData = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/files/filedata/${id}`);
      const data = res.data?.data || [];
      setFileData(data);
      
      if (data.length > 0) {
        setDataStats({
          totalRows: data.length,
          totalColumns: Object.keys(data[0]).length,
          columns: Object.keys(data[0])
        });
      }
    } catch (err) {
      console.error("Error loading parsed file data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (id) => {
    setSelectedFileId(id);
    setCurrentPage(1);
    fetchParsedFileData(id);
  };

  // Filter data based on search term
  const filteredData = fileData.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-path"></div>
      </div>
      <p>📊 Analyzing your data...</p>
    </div>
  );

  const StatsCard = ({ icon, label, value, color }) => (
    <div className={`stats-card ${color}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-info">
        <span className="stats-value">{value}</span>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="chart-page">
      <div className="animated-background">
        <div className="bg-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
        <div className="bg-grid"></div>
      </div>

      <div className="page-header">
        <h1 className="chart-title">
          <span className="title-icon">📊</span>
          File Analysis Dashboard
          <div className="title-underline"></div>
        </h1>
        <p className="page-subtitle">Transform your Excel data into meaningful insights</p>
      </div>

      {!fileId && (
        <div className="file-selection-section">
          <div className="selection-card">
            <h3>🗂️ Select Your File</h3>
            <div className="custom-select">
              <select
                value={selectedFileId}
                onChange={(e) => handleFileSelect(e.target.value)}
                className="file-dropdown"
              >
                <option value="">-- Choose a file to analyze --</option>
                {fileList.map((file) => (
                  <option key={file._id} value={file._id}>
                    📄 {file.originalname}
                  </option>
                ))}
              </select>
              <div className="select-arrow">▼</div>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {selectedFileId && !loading && (
        <>
          {dataStats && (
            <div className="stats-section">
              <StatsCard 
                icon="📋" 
                label="Total Rows" 
                value={dataStats.totalRows.toLocaleString()} 
                color="blue" 
              />
              <StatsCard 
                icon="📊" 
                label="Columns" 
                value={dataStats.totalColumns} 
                color="green" 
              />
              <StatsCard 
                icon="🔍" 
                label="Filtered" 
                value={filteredData.length.toLocaleString()} 
                color="purple" 
              />
            </div>
          )}

          {fileData.length > 0 ? (
            <div className="data-section">
              <div className="data-controls">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="🔍 Search through your data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="view-controls">
                  <button
                    className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    📋 Table
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                    onClick={() => setViewMode('cards')}
                  >
                    🃏 Cards
                  </button>
                </div>
              </div>

              <div className="data-preview">
                {viewMode === 'table' ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {Object.keys(fileData[0]).map((header, idx) => (
                            <th key={idx}>
                              <span className="header-text">{header}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((row, rowIndex) => (
                          <tr key={rowIndex} className="table-row">
                            {Object.values(row).map((cell, colIndex) => (
                              <td key={colIndex}>
                                <span className="cell-content">{cell}</span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="cards-container">
                    {currentItems.map((row, rowIndex) => (
                      <div key={rowIndex} className="data-card">
                        <div className="card-header">
                          <span className="card-number">#{indexOfFirstItem + rowIndex + 1}</span>
                        </div>
                        <div className="card-content">
                          {Object.entries(row).map(([key, value], idx) => (
                            <div key={idx} className="card-field">
                              <span className="field-label">{key}:</span>
                              <span className="field-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      ← Previous
                    </button>
                    
                    <div className="page-info">
                      <span>Page {currentPage} of {totalPages}</span>
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Data Found</h3>
              <p>The selected file appears to be empty or couldn't be processed.</p>
            </div>
          )}
        </>
      )}

      {!selectedFileId && !loading && (
        <div className="welcome-state">
          <div className="welcome-animation">
            <div className="pulse-circle"></div>
            <div className="chart-icon">📈</div>
          </div>
          <h2>Welcome to Excel Analytics</h2>
          <p>Select a file from the dropdown above to start analyzing your data</p>
        </div>
      )}
    </div>
  );
};

export default ChartPage;