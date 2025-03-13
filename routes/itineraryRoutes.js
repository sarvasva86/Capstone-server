import { authenticateUser } from "../middleware/auth.js";
import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// Validation Middleware
const validateItinerary = (req, res, next) => {
  const { title, activities } = req.body;
  
  if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
  if (!Array.isArray(activities) || activities.filter(a => a?.trim()).length === 0) {
    return res.status(400).json({ error: "At least one valid activity required" });
  }

  req.body.title = title.trim();
  req.body.activities = activities
    .map(a => a?.trim())
    .filter(a => a);

  next();
};

// POST Route
router.post("/", authenticateUser, validateItinerary, async (req, res) => {
  try {
    const { title, activities, startDate, endDate } = req.body;

    const newItinerary = new Itinerary({
      userId: req.user.id,
      title,
      activities: activities || [],
      description: description || "",
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });

    const savedItinerary = await newItinerary.save();

    // Explicit response format
    res.status(201).json({
      _id: savedItinerary._id,
      title: savedItinerary.title,
      activities: savedItinerary.activities,
      startDate: savedItinerary.startDate.toISOString(),
      endDate: savedItinerary.endDate.toISOString(),
      createdAt: savedItinerary.createdAt.toISOString()
    });

  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ 
      error: "Failed to save itinerary",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// GET Route
router.get("/", authenticateUser, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(itineraries.map(it => ({
      _id: it._id,
      title: it.title,
      activities: it.activities,
      startDate: it.startDate.toISOString(),
      endDate: it.endDate.toISOString(),
      createdAt: it.createdAt.toISOString()
    })));

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch itineraries",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

export default router;
