const mongoose = require("mongoose");  // Import Mongoose

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name is required
  email: { type: String, required: true, unique: true },  // Email must be unique
  password: { type: String, required: true },  // Store hashed password
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model("User", UserSchema);  // Export model

