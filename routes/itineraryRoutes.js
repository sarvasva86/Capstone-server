import { authenticateUser } from "../middleware/auth.js";
import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// ✅ Validation Middleware
const validateItinerary = (req, res, next) => {
  const { title, activities, startDate, endDate } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!Array.isArray(activities) || activities.filter(a => a?.trim()).length === 0) {
    return res.status(400).json({ error: "At least one valid activity is required" });
  }

  if (startDate && isNaN(new Date(startDate))) {
    return res.status(400).json({ error: "Invalid start date format" });
  }

  if (endDate && isNaN(new Date(endDate))) {
    return res.status(400).json({ error: "Invalid end date format" });
  }

  req.body.title = title.trim();
  req.body.activities = activities.map(a => a?.trim()).filter(a => a);

  next();
};

// ✅ POST Route: Create Itinerary
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, activities, description, startDate, endDate } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const newItinerary = new Itinerary({
      userId: req.user.id, // ✅ Ensure correct user ID is used
      title,
      activities: activities || [],
      description: description?.trim() || "",
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
    });

    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save itinerary" });
  }
});


// ✅ GET Route: Fetch User Itineraries
router.get("/", authenticateUser, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const itineraries = await Itinerary.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(itineraries.map(it => ({
      _id: it._id,
      title: it.title,
      activities: it.activities || [],
      description: it.description || "",
      startDate: it.startDate ? new Date(it.startDate).toISOString() : null, // ✅ Prevent `.toISOString()` error
      endDate: it.endDate ? new Date(it.endDate).toISOString() : null, // ✅ Prevent `.toISOString()` error
      createdAt: it.createdAt ? new Date(it.createdAt).toISOString() : null // ✅ Prevent `.toISOString()` error
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
