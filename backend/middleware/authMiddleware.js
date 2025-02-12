const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({ error: "Please log in" });
    }

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedUser;

    if (!id) {
      return res.status(403).json({ error: "Invalid token, try logging in again" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(403).json({ error: "Invalid token or user not found" });
    }
    // 
    res.cookie("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    // 
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ error: "Unauthorized. Please log in again." });
  }
};

module.exports = authMiddleware;
