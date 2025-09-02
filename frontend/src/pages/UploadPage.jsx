import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UploadPage.css";
import { toast, ToastContainer } from "react-toastify";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Open navbar automatically when page loads
  useEffect(() => {
    const toggleBtn = document.querySelector(".navbar-toggle-btn");
    const navbar = document.querySelector(".navbar");

    // Open if not already open
    if (toggleBtn && !navbar?.classList.contains("open")) {
      toggleBtn.click();
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("✅ File uploaded successfully");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error("❌ Upload failed");
    }
  };

  return (
    <>
      <h2 className="title-icon">📁 Upload Excel Files</h2>
       <div className="title-underline"></div>

      <div className="modal-content page-version">
        <div className="upload-left">
          <div className="drop-zone">
            <p>📤 Drag and Drop files to upload</p>
            <input type="file" onChange={handleFileChange} />
            <button className="upload-btn" onClick={handleUpload}>Upload</button>
            <p className="note">Supported: XLS, XLSX</p>
          </div>
        </div>

        <div className="upload-right">
          <h4>Uploaded Files</h4>
          <ul className="uploaded-files-list">
            <li><span>{selectedFile?.name || "No file selected"}</span></li>
          </ul>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default UploadPage;
