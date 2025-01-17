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
