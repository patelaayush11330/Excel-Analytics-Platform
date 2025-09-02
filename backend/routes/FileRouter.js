//filerouter.js
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/multer"); // Multer middleware for file upload
const fileController = require("../controllers/fileController");

// ✅ Upload & Parse Excel File (Authenticated)
router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  fileController.uploadFile
);

// ✅ Get All Files Belonging to the Logged-in User
router.get("/", verifyToken, fileController.getAllFiles);

// ✅ Get Parsed Data for a Specific File (User-only access)
router.get("/filedata/:id", verifyToken, fileController.getFileData);

// ✅ Delete File and Its Parsed Data (Only if owned by user)
router.delete("/:id", verifyToken, fileController.deleteFile);

// ✅ Download Original Uploaded File (If owned by user)
router.get("/download/:id", verifyToken, fileController.downloadFile);

module.exports = router;
