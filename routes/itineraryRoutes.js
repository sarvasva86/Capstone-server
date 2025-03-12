import { authenticateUser } from "../middleware/auth.js";
import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// ✅ Middleware to Validate Itinerary Data
const validateItinerary = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }

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
  req.body.activities = activities.map(activity => activity?.trim()).filter(activity => activity);

  next();
};

// ✅ FIXED: Merged `POST` Route (With Authentication & Validation)
router.post("/", authenticateUser, validateItinerary, async (req, res) => {
  try {
    const { title, description, startDate, endDate, activities } = req.body;

    // Ensure `userId` is included
    const newItinerary = new Itinerary({
      userId: req.user.id, // ✅ Added `userId`
      title,
      description: description?.trim() || "",
      activities,
      startDate: new Date(startDate) || new Date(),
      endDate: new Date(endDate) || new Date(),
    });

    const savedItinerary = await newItinerary.save();

    res.status(201).json(savedItinerary);
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save itinerary" });
  }
});

// ✅ FIXED: `GET` Route - Fetch All User Itineraries
router.get("/", authenticateUser, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.id }) // ✅ FIXED: `userId` instead of `user`
      .sort({ createdAt: -1 })
      .lean();

    res.json(itineraries.map(it => ({
      ...it,
      startDate: it.startDate ? new Date(it.startDate).toISOString() : null,
      endDate: it.endDate ? new Date(it.endDate).toISOString() : null,
      createdAt: it.createdAt ? new Date(it.createdAt).toISOString() : null
    })));
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

export default router;
