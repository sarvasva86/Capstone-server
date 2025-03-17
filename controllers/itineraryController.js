const Itinerary = require("../models/Itinerary");

// ✅ Create Itinerary
exports.createItinerary = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newItinerary = new Itinerary({
      title,
      description,
      startDate,
      endDate,
      userId: req.userId, // Assuming authentication middleware exists
    });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Itineraries
exports.getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.userId }); // Fetch only user's itineraries
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
