//filecontroller.js
const xlsx = require("xlsx");
const File = require("../models/File");
const FileData = require("../models/Filedata");

// ✅ Upload & Parse Excel File (linked to logged-in user)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames?.[0];
    if (!sheetName) {
      return res.status(400).json({ message: "No sheet found in Excel file." });
    }

    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: "Excel sheet has no data." });
    }

    // Save original file buffer
    const newFile = new File({
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
      user: req.user.id, // ✅ associate file with user
    });
    const savedFile = await newFile.save();

    // Save parsed data
    const fileData = new FileData({
      fileId: savedFile._id,
      data: jsonData,
      user: req.user.id, // ✅ associate data with user
    });
    await fileData.save();

    res.status(200).json({
      message: "File uploaded and parsed successfully",
      file: savedFile,
      parsedRows: jsonData.length,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// ✅ Get All Files for Logged-in User
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files", error: error.message });
  }
};

// ✅ Get Parsed Data (Only if user owns it)
exports.getFileData = async (req, res) => {
  try {
    const fileData = await FileData.findOne({
      fileId: req.params.id,
      user: req.user.id,
    });
    if (!fileData) {
      return res.status(404).json({ message: "Parsed data not found or unauthorized" });
    }

    res.status(200).json({ data: fileData.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching parsed data", error: error.message });
  }
};

// ✅ Delete File & Parsed Data (Only if user owns it)
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user.id });
    if (!file) {
      return res.status(404).json({ message: "File not found or unauthorized" });
    }

    await File.findByIdAndDelete(req.params.id);
    await FileData.findOneAndDelete({ fileId: req.params.id, user: req.user.id });

    res.status(200).json({ message: "File and parsed data deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

// ✅ Download File (Only if user owns it)
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user.id });
    if (!file) {
      return res.status(404).json({ message: "File not found or unauthorized" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${file.originalname}"`);
    res.setHeader("Content-Type", file.mimetype);
    res.send(file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Download error", error: err.message });
  }
};
