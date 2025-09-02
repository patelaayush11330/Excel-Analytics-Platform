//authcontroller.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Register Controller
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 🔒 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🆕 Create new user with empty arrays (files, notes)
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      files: [],
      notes: [],
    });
if (!process.env.JWT_SECRET) {
  console.log("❌ JWT_SECRET not found in .env file!");
}

    const token = generateToken(user);
console.log("Generated token:", token); // ✅ Add this

res.status(201).json({
  message: "User registered successfully",
  user: {
    id: user._id,
    email: user.email,
    role: user.role,
  },
  token,
});

console.log("Response sent:", {
  user: {
    id: user._id,
    email: user.email,
    role: user.role,
  },
  token,
});

  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};


// ✅ login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ First Login Setup
    if (user.firstLogin) {
      user.notes.push("👋 Welcome to your dashboard! Start by uploading a file.");
      user.files.push("📄 Sample File.txt"); // optional: simulate default
      user.firstLogin = false;
      await user.save(); // save updates
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};


// ✅ Profile Controller
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email role files notes");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      email: user.email,
      role: user.role,
      files: user.files,
      notes: user.notes,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};
