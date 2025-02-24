const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  name: String,
  location: {
    lat: Number,
    lng: Number,
  },
  weather: {
    temperature: Number,
    condition: String,
  },
  attractions: [String],
});

module.exports = mongoose.model("Destination", DestinationSchema);
