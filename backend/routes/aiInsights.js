const express = require("express");
const router = express.Router();
const FileData = require("../models/FileData");
const { generateInsightsFromData } = require("../utils/aiHelper");

router.get("/ai-insights/:fileId", async (req, res) => {
  try {
    const fileData = await FileData.findOne({ fileId: req.params.fileId });
    if (!fileData) return res.status(404).json({ message: "File not found" });

    const insights = generateInsightsFromData(fileData.data);

    res.status(200).json({ insights });
  } catch (error) {
    console.error("AI Insight error:", error);
    res.status(500).json({ message: "Failed to generate AI insights" });
  }
});

module.exports = router;
