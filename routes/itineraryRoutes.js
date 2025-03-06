import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// Enhanced validation middleware
const validateItinerary = (req, res, next) => {
  const { title, activities } = req.body;
  
  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  
  if (!Array.isArray(activities) || activities.length === 0) {
    return res.status(400).json({ error: "At least one activity is required" });
  }

  // Clean activities array
  req.body.activities = activities
    .map(activity => activity.trim())
    .filter(activity => activity !== '');

  if (req.body.activities.length === 0) {
    return res.status(400).json({ error: "Valid activities required" });
  }

  next();
};

// Get all itineraries
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find().sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single itinerary by ID
router.get("/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.json(itinerary);
  } catch (error) {
    console.error("GET by ID error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new itinerary
router.post("/", validateItinerary, async (req, res) => {
  try {
    const newItinerary = new Itinerary({
      ...req.body,
      title: req.body.title.trim()
    });
    
    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    console.error("POST error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update itinerary
router.put("/:id", validateItinerary, async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      { ...req.body, title: req.body.title.trim() },
      { new: true, runValidators: true }
    );
    
    if (!updatedItinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    res.json(updatedItinerary);
  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete itinerary
router.delete("/:id", async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    
    if (!deletedItinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    res.json({ 
      message: "Itinerary deleted successfully",
      deletedId: deletedItinerary._id 
    });
  } catch (error) {
    console.error("DELETE error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
