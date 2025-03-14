import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// ✅ Validation Middleware
const validateItinerary = (req, res, next) => {
  const { title, description, activities, startDate, endDate } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  req.body.title = title.trim();
  req.body.description = description?.trim() || "No description available.";
  req.body.activities = Array.isArray(activities) ? activities.filter(a => a?.trim()) : [];

  next();
};

// ✅ Fetch User Itineraries (GET /api/itineraries)
router.get("/", authenticateUser, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.id }).lean();
    res.json(itineraries);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});


// ✅ POST Route: Create Itinerary
router.post("/", authenticateUser, validateItinerary, async (req, res) => {
  try {
    const { title, description, activities, startDate, endDate } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const newItinerary = new Itinerary({
      userId: req.user.id,
      title,
      description,
      activities,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
    });

    const savedItinerary = await newItinerary.save();

    res.status(201).json({
      _id: savedItinerary._id,
      title: savedItinerary.title,
      description: savedItinerary.description,
      activities: savedItinerary.activities,
      startDate: savedItinerary.startDate.toISOString(),
      endDate: savedItinerary.endDate.toISOString(),
    });

  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save itinerary" });
  }
});

export default router; 
