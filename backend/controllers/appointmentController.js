const Appointment = require("../models/Appointment");

exports.getAppointments = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming request
    console.log("Decoded user:", req.user);
    const appointments = await Appointment.find({ patientId: req.user.id });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
};
