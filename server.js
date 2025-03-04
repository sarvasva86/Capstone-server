const express = require("express");  // Import Express framework
const mongoose = require("mongoose");  // Import Mongoose to connect to MongoDB
const cors = require("cors");  // Import CORS to handle cross-origin requests
require("dotenv").config();  // Load environment variables

const authRoutes = require("./routes/authRoutes");  // Import authentication routes
const itineraryRoutes = require("./routes/itineraryRoutes");  // Import itinerary routes

const app = express();  // Initialize Express application

app.use(express.json());  // Enable JSON parsing for incoming requests
app.use(cors({
  origin:'https://capstone-frontend-0red.onrender.com',  // Allow all origins (change to frontend URL in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Allow methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers
}));

// Handle preflight requests
app.options('*', cors());


// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Database Connection Error:", err));

// ✅ Include authentication routes
app.use("/api/auth", authRoutes);  // Use authentication routes at "/api/auth"
app.use("/api/itineraries", itineraryRoutes);  // Use itinerary routes at "/api/itineraries"

const PORT = process.env.PORT || 5000;  // Set port from environment or default to 5000
console.log("Routes Loaded:", app._router.stack.map(r => r.route && r.route.path));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // Start the server

