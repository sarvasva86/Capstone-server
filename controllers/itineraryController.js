const itineraryService = require("../services/itineraryService");

// ✅ Create Itinerary
exports.createItinerary = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const itinerary = await itineraryService.createItinerary({
      title,
      description,
      startDate,
      endDate,
      userId: req.userId, // Assuming authentication middleware exists
    });

    res.status(201).json(itinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Itineraries
exports.getItineraries = async (req, res) => {
  try {
    const itineraries = await itineraryService.getUserItineraries(req.userId);
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Single Itinerary by ID
exports.getItineraryById = async (req, res) => {
  try {
    const itinerary = await itineraryService.getItineraryById(req.params.id, req.userId);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Itinerary
exports.updateItinerary = async (req, res) => {
  try {
    const updatedItinerary = await itineraryService.updateItinerary(req.params.id, req.body, req.userId);
    if (!updatedItinerary) {
      return res.status(404).json({ error: "Itinerary not found or unauthorized" });
    }
    res.json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Itinerary
exports.deleteItinerary = async (req, res) => {
  try {
    const deleted = await itineraryService.deleteItinerary(req.params.id, req.userId);
    if (!deleted) {
      return res.status(404).json({ error: "Itinerary not found or unauthorized" });
    }
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
