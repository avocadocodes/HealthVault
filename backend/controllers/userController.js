const User = require("../models/User"); 
exports.getDoctors = async (req, res) => {
  try {
    const { name, specialty } = req.query;
    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" }; 
    }
    if (specialty) {
      query.specialty = { $regex: specialty, $options: "i" }; 
    }
    const doctors = await User.find({ role: "doctor", ...query });
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error searching doctors:", error);
    res.status(500).json({ message: "Failed to search doctors." });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId).select("name email role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

