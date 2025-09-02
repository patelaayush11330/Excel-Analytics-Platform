//admincontroller.js
const User = require("../models/user");
const File = require("../models/File");
const ChartHistory = require("../models/chartHistory");

exports.getUserOverview = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("name email role status");

    const userData = await Promise.all(
      users.map(async (user) => {
        const files = await File.find({ user: user._id });
        const fileIds = files.map((f) => f._id);

        const charts = await ChartHistory.find({ user: user._id });
        const workedFileIds = charts.map((c) => c.fileId.toString());

        const workedFiles = files.filter((file) =>
          workedFileIds.includes(file._id.toString())
        );
        const untouchedFiles = files.filter(
          (file) => !workedFileIds.includes(file._id.toString())
        );

        return {
          userId: user._id,
          name: user.name || "N/A",
          email: user.email,
          role: user.role,
          status: user.status,
          totalFiles: files.length,
          workedFiles: workedFiles.map((f) => f.originalname),
          untouchedFiles: untouchedFiles.map((f) => f.originalname),
        };
      })
    );

    res.status(200).json(userData);
  } catch (err) {
    console.error("Admin overview error:", err);
    res.status(500).json({ message: "Failed to fetch user overview" });
  }
};

exports.getUserFiles = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Optional: Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const files = await File.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};