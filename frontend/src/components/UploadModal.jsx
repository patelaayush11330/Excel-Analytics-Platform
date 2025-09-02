import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/Upload.css";
import { toast } from "react-toastify";

const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Add entrance animation
    const modal = document.querySelector('.upload-modal');
    if (modal) {
      modal.classList.add('entering');
      setTimeout(() => modal.classList.remove('entering'), 300);
    }
  }, []);

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const isValidType = file.name.toLowerCase().match(/\.(xlsx|xls|csv)$/);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid Excel file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    const combined = [...selectedFiles, ...validFiles];
    const unique = combined.filter((file, index, self) =>
      index === self.findIndex(f => f.name === file.name && f.size === file.size)
    );
    
    setSelectedFiles(unique);
    
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) added successfully! 📄`);
    }
  };

  const removeFile = (index) => {
    const files = [...selectedFiles];
    const removedFile = files.splice(index, 1)[0];
    setSelectedFiles(files);
    toast.info(`${removedFile.name} removed`);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = selectedFiles.length;
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);
        
        await axios.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const fileProgress = (progressEvent.loaded / progressEvent.total) * 100;
            const totalProgress = ((i / totalFiles) * 100) + (fileProgress / totalFiles);
            setUploadProgress(Math.round(totalProgress));
          }
        });
      }

      toast.success(`🎉 ${selectedFiles.length} file(s) uploaded successfully!`);
      setSelectedFiles([]);
      onUploadSuccess();
      
      // Add exit animation before closing
      const modal = document.querySelector('.upload-modal');
      if (modal) {
        modal.classList.add('exiting');
        setTimeout(() => onClose(), 300);
      } else {
        onClose();
      }
      
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    const modal = document.querySelector('.upload-modal');
    if (modal) {
      modal.classList.add('exiting');
      setTimeout(() => onClose(), 300);
    } else {
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-modal-overlay">
      {/* Animated background */}
      <div className="upload-bg-animation">
        <div className="upload-particles">
          <div className="upload-particle"></div>
          <div className="upload-particle"></div>
          <div className="upload-particle"></div>
          <div className="upload-particle"></div>
        </div>
      </div>

      <div className="upload-modal">
        <button className="close-button" onClick={handleClose}>
          <span className="close-icon">✕</span>
        </button>

        <div className="upload-header">
          <h2 className="upload-title">
            <span className="title-icon">📤</span>
            Upload Excel Files
          </h2>
          <p className="upload-subtitle">
            Drag and drop your files or browse to select
          </p>
        </div>

        <div className="upload-grid">
          {/* LEFT: Enhanced Drop Zone */}
          <div
            ref={dropZoneRef}
            className={`drop-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-zone-content">
              <div className="upload-animation">
                <div className="upload-icon-wrapper">
                  <div className="upload-icon">📁</div>
                  <div className="upload-pulse"></div>
                </div>
              </div>
              
              <div className="drop-text">
                <p className="drop-main-text">
                  {isDragging ? 'Drop files here' : 'Drag & Drop files here'}
                </p>
                <span className="drop-or">or</span>
                <button 
                  className="browse-button"
                  type="button"
                  disabled={isUploading}
                >
                  <span className="browse-icon">🔍</span>
                  Browse Files
                </button>
              </div>

              <div className="file-info">
                <small className="file-types">Supported: .xlsx, .xls, .csv</small>
                <small className="file-size">Max size: 10MB per file</small>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              multiple
              onChange={handleFilesChange}
              hidden
              disabled={isUploading}
            />
          </div>

          {/* RIGHT: Enhanced File List */}
          <div className="file-list">
            <div className="file-list-header">
              <h4 className="file-list-title">
                <span className="list-icon">📋</span>
                Selected Files
                {selectedFiles.length > 0 && (
                  <span className="file-count">({selectedFiles.length})</span>
                )}
              </h4>
            </div>

            <div className="file-list-scroll">
              {selectedFiles.length === 0 ? (
                <div className="empty-file-list">
                  <div className="empty-icon">📭</div>
                  <p>No files selected yet</p>
                  <small>Files will appear here after selection</small>
                </div>
              ) : (
                <div className="file-items">
                  {selectedFiles.map((file, index) => (
                    <div className="file-item" key={`${file.name}-${index}`}>
                      <div className="file-info-wrapper">
                        <span className="file-icon">📄</span>
                        <div className="file-details">
                          <span className="file-name" title={file.name}>
                            {file.name}
                          </span>
                          <span className="file-size">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)} 
                        className="delete-btn"
                        disabled={isUploading}
                        title="Remove file"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="upload-footer">
          <button 
            className={`upload-submit-btn ${selectedFiles.length === 0 ? 'disabled' : ''} ${isUploading ? 'uploading' : ''}`}
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <div className="upload-spinner"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span className="upload-btn-icon">🚀</span>
                <span>Upload {selectedFiles.length > 0 ? `${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}` : 'Files'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;