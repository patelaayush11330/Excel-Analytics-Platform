//uploadhistory.js
const mongoose = require("mongoose");

const UploadHistorySchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.UploadHistory || mongoose.model("UploadHistory", UploadHistorySchema);
