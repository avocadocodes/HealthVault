const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user:", decoded); // Log the decoded token
    req.user = await User.findById(decoded.id).select("-password");
    console.log("User found in DB:", req.user); // Log the user fetched from DB
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};


module.exports = authMiddleware;
