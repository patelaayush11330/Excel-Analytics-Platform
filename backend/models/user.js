//user.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File", // Links uploaded files
      },
    ],
    notes: [
      {
        type: String, // Could be expanded to a Note schema if needed
      },
    ],
  
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
