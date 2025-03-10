import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  userId: String,
  destinations: [String],
  activities: [String],    // User-defined activities
  startDate: Date,
  endDate: Date,
  savedActivities: [{ type: String }] // Tracks user preferences
});

export default mongoose.model("Itinerary", itinerarySchema);
