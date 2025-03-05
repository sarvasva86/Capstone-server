import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js"; // Ensure this model exists

const router = express.Router();

// Proper signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
