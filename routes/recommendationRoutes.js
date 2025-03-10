import express from "express";
import axios from "axios";
import Itinerary from "../models/Itinerary.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// 🧠 AI-Powered Activity Recommendations
const getActivityRecommendations = async (destination, userPreferences) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+things+to+do+in+${destination}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const activities = response.data.results;

    // Filter activities based on user preferences
    const recommendedActivities = activities.filter(activity =>
      userPreferences.some(pref => activity.name.toLowerCase().includes(pref))
    );

    return recommendedActivities;
  } catch (error) {
    console.error("Error fetching activity recommendations:", error);
    return [];
  }
};

// 🌍 Weather-Based Activity Recommendations
const getWeatherForecast = async (destination) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.weather[0].main; // Example: "Rain", "Clear", "Snow"
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return "Unknown";
  }
};

// Match activities with weather conditions
const recommendActivitiesByWeather = (weatherCondition) => {
  const weatherBasedActivities = {
    Clear: ["Hiking", "Beach", "Outdoor sightseeing"],
    Rain: ["Museums", "Indoor cafes", "Shopping malls"],
    Snow: ["Skiing", "Hot springs", "Indoor concerts"],
  };

  return weatherBasedActivities[weatherCondition] || ["Explore local attractions"];
};

// 📌 API Endpoint: AI-Based Activity Recommendations
router.get("/recommendations/:destination", authenticateUser, async (req, res) => {
  const { destination } = req.params;
  const userId = req.user.id;

  try {
    // Fetch user activity preferences from past trips
    const userItineraries = await Itinerary.find({ userId }).lean();
    const userPreferences = [...new Set(userItineraries.flatMap(it => it.activities))];

    // Get AI-based activity recommendations
    const recommendations = await getActivityRecommendations(destination, userPreferences);

    res.json({ destination, recommendations });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// 📌 API Endpoint: Weather-Based Activity Recommendations
router.get("/weather-recommendations/:destination", async (req, res) => {
  const { destination } = req.params;

  try {
    const weatherCondition = await getWeatherForecast(destination);
    const recommendedActivities = recommendActivitiesByWeather(weatherCondition);

    res.json({ destination, weather: weatherCondition, recommendations: recommendedActivities });
  } catch (error) {
    console.error("Weather recommendation error:", error);
    res.status(500).json({ error: "Failed to fetch weather-based recommendations" });
  }
});

export default router;
