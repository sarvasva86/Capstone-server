const Itinerary = require("../models/Itinerary");

// ✅ Service: Create Itinerary
const createItinerary = async ({ title, description, startDate, endDate }) => {
  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  const newItinerary = new Itinerary({
    title,
    description,
    startDate,
    endDate,
  });

  return await newItinerary.save();
};

// ✅ Service: Get All Itineraries
const getAllItineraries = async () => {
  return await Itinerary.find();
};

module.exports = { createItinerary, getAllItineraries };
