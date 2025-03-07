
import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// Enhanced validation middleware
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

  // Clean and transform data
  req.body.title = title.trim();
  req.body.activities = activities
    .map(activity => activity?.trim())
    .filter(activity => activity);

  next();
};

// POST - Create itinerary (with date handling)
router.post("/", validateItinerary, async (req, res) => {
  try {
    const newItinerary = new Itinerary({
      title: req.body.title,
      description: req.body.description?.trim() || '',
      activities: req.body.activities,
      startDate: req.body.startDate || Date.now(),
      endDate: req.body.endDate || Date.now()
    });

    const savedItinerary = await newItinerary.save();
    
    res.status(201).json({
      ...savedItinerary.toObject(),
      // Convert dates to ISO strings for frontend consistency
      startDate: savedItinerary.startDate.toISOString(),
      endDate: savedItinerary.endDate.toISOString()
    });

  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ 
      error: "Failed to save itinerary",
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// GET - All itineraries (with sorting)
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find()
      .sort({ createdAt: -1 })
      .lean();

    const formattedItineraries = itineraries.map(it => ({
      ...it,
      startDate: it.startDate.toISOString(),
      endDate: it.endDate.toISOString(),
      createdAt: it.createdAt.toISOString()
    }));

    res.json(formattedItineraries);

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch itineraries",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });  // Added closing curly brace and parenthesis
  }
});  

export default router; 
