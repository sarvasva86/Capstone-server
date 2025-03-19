const Itinerary = require("../models/Itinerary");

// ✅ Create Itinerary
const createItinerary = async ({ title, description, startDate, endDate, userId }) => {
  const newItinerary = new Itinerary({
    title,
    description,
    startDate,
    endDate,
    userId,
  });

  return await newItinerary.save();
};

// ✅ Get All Itineraries for a User
const getUserItineraries = async (userId) => {
  return await Itinerary.find({ userId });
};

// ✅ Get Single Itinerary by ID
const getItineraryById = async (id, userId) => {
  return await Itinerary.findOne({ _id: id, userId });
};

// ✅ Update Itinerary
const updateItinerary = async (id, updateData, userId) => {
  return await Itinerary.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true }
  );
};

// ✅ Delete Itinerary
const deleteItinerary = async (id, userId) => {
  const result = await Itinerary.findOneAndDelete({ _id: id, userId });
  return result ? true : false;
};

module.exports = {
  createItinerary,
  getUserItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
};
