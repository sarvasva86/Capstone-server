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
  req.body.description = description?.trim() || "";
  req.body.activities = Array.isArray(activities) ? activities.filter(a => a?.trim()) : [];

  next();
};

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

// ✅ GET Route: Fetch Itineraries
router.get("/", authenticateUser, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const itineraries = await Itinerary.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();

    res.json(itineraries.map(it => ({
      _id: it._id,
      title: it.title || "Untitled Itinerary",
      description: it.description || "No description available.",
      activities: it.activities || [],
      startDate: it.startDate ? new Date(it.startDate).toISOString() : null,
      endDate: it.endDate ? new Date(it.endDate).toISOString() : null,
    })));

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

export default router;
