const multer = require("multer");
const path = require("path");

// ✅ In-memory storage (faster, no temp files)
const storage = multer.memoryStorage();

// ✅ File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".xlsx", ".xls", ".csv"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only Excel or CSV files are allowed."));
  }
};

// ✅ Multer setup with size limit (2MB)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = upload;
