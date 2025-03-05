const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Signup Route
router.post("/register", authController.register);
router.post("/signup", (req, res) => { ... });

module.exports = router; // Critical!


router.post("/login", authController.login);
module.exports = router;
