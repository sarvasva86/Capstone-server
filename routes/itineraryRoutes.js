import express from "express";
import Itinerary from "../models/Itinerary.js"; // Add .js extension

const router = express.Router();

// Get all itineraries
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create new itinerary
router.post("/", async (req, res) => {
  try {
    // Basic validation
    if (!req.body.title || !req.body.activities) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const newItinerary = new Itinerary(req.body);
    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
