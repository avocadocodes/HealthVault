const User = require("../models/User");

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    // Fetch users with the role "doctor"
    const doctors = await User.find({ role: "doctor" }).select(
      "name email role specialty"
    ); // Include specialty if applicable
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
