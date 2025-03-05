import express from "express";
const router = express.Router();
import Itinerary from "../models/Itinerary";

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

export default router;


