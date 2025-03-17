import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "No description available.", trim: true },
  activities: [{ type: String, trim: true }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

export default mongoose.model("Itinerary", ItinerarySchema);
