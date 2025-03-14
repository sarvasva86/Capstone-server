import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Function to Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" }); // ⏳ Extended to 7 Days
};

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT
    const token = generateToken(newUser._id);

    res.status(201).json({ 
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("FATAL: JWT_SECRET not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Generate JWT Token
    const token = generateToken(user._id);

    res.json({ 
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// ✅ Token Refresh Route (If Expired)
router.post("/refresh-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      // Generate new token
      const newToken = generateToken(decoded.userId);
      res.json({ token: newToken });
    });

  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

export default router;

