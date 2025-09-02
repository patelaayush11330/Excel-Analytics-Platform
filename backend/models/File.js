//file.js

const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",           // Reference to User model
      required: true,        // Ensures every file is linked to a user
    },
    filename: {
      type: String,
    },
    originalname: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
    },
    buffer: {
      type: Buffer,
    },
    // Optionally, you can store analysis status or chart info here
    chartGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.models.File || mongoose.model("File", FileSchema);

