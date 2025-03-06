import express from "express";
import Itinerary from "../models/Itinerary.js";

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

// Get single itinerary by ID
router.get("/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create new itinerary
router.post("/", async (req, res) => {
  try {
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

// Update itinerary
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.activities) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedItinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    res.json(updatedItinerary);
  } catch (error) {
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
    
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
