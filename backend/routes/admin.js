const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admincontroller");
const verifyToken = require("../middleware/verifyToken");

// Existing overview route
router.get("/overview", verifyToken, adminController.getUserOverview);

// 🔥 NEW route to fetch files of a specific user
router.get("/user-files/:userId", verifyToken, adminController.getUserFiles);

module.exports = router;
