const User = require("../models/User"); 
const cloudinary = require("../utils/cloudinary");

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

exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch doctor profile" });
  }
};

exports.updateDoctorProfile = async (req, res) => {
  try {
    const { name, specialty, clinicAddress, educationHistory } = req.body;
    const updatedDoctor = await User.findByIdAndUpdate(
      req.params.doctorId,
      { name, specialty, clinicAddress, educationHistory },
      { new: true }
    );
    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update doctor profile" });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadedImage = await cloudinary.uploader.upload(req.file.path);
    const doctor = await User.findByIdAndUpdate(
      req.params.doctorId,
      { profilePic: uploadedImage.secure_url },
      { new: true }
    );

    res.status(200).json({ profilePic: doctor.profilePic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
};
