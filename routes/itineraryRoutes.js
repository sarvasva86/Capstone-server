
import { authenticateUser } from "../middleware/auth.js";
import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// Enhanced validation middleware with date checks
const validateItinerary = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const { title, activities, startDate, endDate } = req.body;
  
  // Validate title
  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  
  // Validate activities
  if (!Array.isArray(activities) || activities.filter(a => a?.trim()).length === 0) {
    return res.status(400).json({ error: "At least one valid activity is required" });
  }

  // Validate dates
  if (startDate && isNaN(new Date(startDate))) {
    return res.status(400).json({ error: "Invalid start date format" });
  }

  if (endDate && isNaN(new Date(endDate))) {
    return res.status(400).json({ error: "Invalid end date format" });
  }

  // Clean and transform data
  req.body.title = title.trim();
  req.body.activities = activities
    .map(activity => activity?.trim())
    .filter(activity => activity);

  next();
};

// POST - Create itinerary with enhanced date handling
router.post("/", validateItinerary, async (req, res) => {
  try {
    // Parse dates or use current time
    const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
    const endDate = req.body.endDate ? new Date(req.body.endDate) : new Date();

    const newItinerary = new Itinerary({
      title: req.body.title,
      description: req.body.description?.trim() || '',
      activities: req.body.activities,
      startDate,
      endDate
    });

  // Authentication middleware
  const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

    const savedItinerary = await newItinerary.save();
    
    res.status(201).json({
      ...savedItinerary.toJSON(),
      startDate: savedItinerary.startDate.toISOString(),
      endDate: savedItinerary.endDate.toISOString()
    });

  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to save itinerary",
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// GET - All itineraries with error handling
router.get("/", authenticateUser, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

   const formattedItineraries = itineraries.map(it => ({
  ...it,
  startDate: it.startDate ? new Date(it.startDate).toISOString() : null,
  endDate: it.endDate ? new Date(it.endDate).toISOString() : null,
  createdAt: it.createdAt ? new Date(it.createdAt).toISOString() : null
    }));

    res.json(formattedItineraries);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch itineraries",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, description, startDate, endDate, activities } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: "Title, start date, and end date are required" });
    }

    const newItinerary = new Itinerary({
      userId: req.user.id, // Ensure user is authenticated
      title,
      description: description || "",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      activities: activities || [],
    });

    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    console.error("Error saving itinerary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
