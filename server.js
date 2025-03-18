import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

// Configure environment
dotenv.config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Apply CORS Middleware Before Routes
const corsOptions = {
  origin: ["https://capstone-frontend-0red.onrender.com", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Middleware
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/recommendations", recommendationRoutes);

// ✅ AI Travel Suggestions Endpoint (with CORS applied)
app.get("/api/suggestions", (req, res) => {
  const destination = req.query.destination || "Travel";

  const suggestions = [
    `${destination} Beach Adventure`,
    `${destination} City Sightseeing`,
    `${destination} Local Food Tour`,
    `${destination} Museum Exploration`,
    `${destination} Nature Hiking`,
  ];
const travelIdeas = [
  "Beach Adventure",
  "City Sightseeing",
  "Local Food Tour",
  "Museum Exploration",
  "Nature Hiking",
  "River Cruise",
  "Historic Monuments Tour",
  "Nightlife & Bars",
  "Adventure Sports",
  "Shopping & Markets",
];
  
   // Shuffle and pick 5 random suggestions
  const shuffled = travelIdeas.sort(() => 0.5 - Math.random());
  const suggestions = shuffled.slice(0, 5).map((idea) => `${destination} ${idea}`);

  res.json({ suggestions });
});

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ✅ Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is working!" });
});

// Client-side routing fallback
app.get("*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`- GET /api/itineraries`);
  console.log(`- POST /api/itineraries`);
});

