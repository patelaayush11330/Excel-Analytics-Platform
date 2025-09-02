//charthistory.js
const mongoose = require("mongoose");

const chartHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // 👈 ensures chart history belongs to a user
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  chartType: {
    type: String,
    required: true,
  },
  dimension: {
    type: String,
    required: true,
    enum: ["1D", "2D", "3D", "2D3D"],
  },
  xAxis: {
    type: String,
    required: true,
  },
  yAxis: {
    type: String,
  },
  zAxis: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.ChartHistory || mongoose.model("ChartHistory", chartHistorySchema);
