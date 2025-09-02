//charthistory.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ChartHistory = require("../models/chartHistory");
const verifyToken = require("../middleware/verifyToken"); // ✅ auth middleware

// ✅ Save chart history (POST)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { fileId, chartType, dimension, xAxis, yAxis, zAxis } = req.body;

    if (!fileId || !dimension || !xAxis) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid fileId format" });
    }

    const newChart = new ChartHistory({
      user: req.user.id, // ✅ associate with logged-in user
      fileId: new mongoose.Types.ObjectId(fileId),
      chartType,
      dimension,
      xAxis,
      yAxis,
      zAxis,
    });

    await newChart.save();

    res.status(201).json({ message: "Chart history saved" });
  } catch (err) {
    console.error("🔥 Error saving chart history:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get chart history of logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const history = await ChartHistory.find({ user: req.user.id }) // 👈 filter by user
      .populate("fileId", "originalname")
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (err) {
    console.error("🔥 Error fetching chart history:", err.message);
    res.status(500).json({ message: "Failed to fetch chart history" });
  }
});

// ✅ Count charts of current user
router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await ChartHistory.countDocuments({ user: req.user.id }); // 👈 count only their charts
    res.json({ count });
  } catch (err) {
    console.error("Failed to count chart history:", err);
    res.status(500).json({ message: "Server error while counting charts" });
  }
});

module.exports = router;
