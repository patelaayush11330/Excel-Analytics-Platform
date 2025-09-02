//auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

// ✅ Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// 🔐 Protected route (requires valid Bearer token)
router.get("/profile", verifyToken, authController.getProfile);

// routes/auth.js or similar
router.post("/logout", (req, res) => {
  // Optional: clear cookies or session here
  res.clearCookie("token"); // if using cookies
  res.status(200).json({ message: "Logged out" });
});

// 🚪 Optional logout route (only needed if you're managing cookies manually)
// router.post("/logout", authController.logout);

module.exports = router;
