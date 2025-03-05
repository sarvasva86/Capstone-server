import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  userId: String,
  destinations: [String],
  startDate: Date,
  endDate: Date,
});

export default mongoose.model("Itinerary", itinerarySchema);
