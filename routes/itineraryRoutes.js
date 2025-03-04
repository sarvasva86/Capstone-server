const express = require("express");
const router = express.Router();
const Itinerary = require("../models/Itinerary");

router.get('/itineraries', (req, res) => {
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
});

router.post("/", async (req, res) => {
  const newItinerary = new Itinerary(req.body);
  await newItinerary.save();
  res.status(201).json(newItinerary);
});

router.get("/", async (req, res) => {
  const itineraries = await Itinerary.find();
  res.json(itineraries);
});


module.exports = router;

