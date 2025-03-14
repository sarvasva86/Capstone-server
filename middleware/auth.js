import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure `id` is correctly extracted from token
    req.user = { id: decoded.id || decoded.userId };

    if (!req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID in token" });
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// ✅ Generate a new token with longer expiration
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Extends token validity to 7 days
};
