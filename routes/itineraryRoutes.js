import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// Middleware for JSON parsing error handling
router.use(express.json());

// Validation middleware
const validateItinerary = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const { title, activities } = req.body;
  
  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  
  if (!Array.isArray(activities) || activities.filter(a => a?.trim()).length === 0) {
    return res.status(400).json({ error: "At least one valid activity is required" });
  }

  // Clean data
  req.body.title = title.trim();
  req.body.activities = activities
    .map(activity => activity?.trim())
    .filter(activity => activity);

  next();
};

// Create itinerary
router.post("/", validateItinerary, async (req, res) => {
  try {
    console.log("Creating itinerary:", req.body);
    
    const newItinerary = new Itinerary({
      title: req.body.title,
      description: req.body.description?.trim() || '',
      activities: req.body.activities
    });

    const savedItinerary = await newItinerary.save();
    
    res.status(201)
      .header('Content-Type', 'application/json')
      .json(savedItinerary);

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
