import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import { getTravelSuggestions } from "./controllers/suggestionController.js"; // ✅ New controller for suggestions

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
  credentials: true, // ✅ Ensures proper CORS handling for cookies/auth
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Middleware
app.use(express.json());

// ✅ Database Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if database fails to connect
  });

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.get("/api/suggestions", getTravelSuggestions); // ✅ Use the new AI suggestions controller

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
