import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ Ensure correct user ID is set
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);

    // ✅ Handle expired tokens explicitly
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    return res.status(401).json({ 
      error: "Invalid token",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};
