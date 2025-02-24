const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  userId: String,
  destinations: [String],
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("Itinerary", ItinerarySchema);
