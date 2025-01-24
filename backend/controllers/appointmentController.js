const Appointment = require("../models/Appointment");

const getAppointments = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming request
    console.log("Decoded user:", req.user);
    const appointments = await Appointment.find({ doctorId: req.user.id });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { patientName, healthIssue, date, time } = req.body;

    // Validation
    if (!patientName || !healthIssue || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const appointment = new Appointment({
      doctorId: req.user.id,
      patientName,
      healthIssue,
      date,
      time,
    });

    await appointment.save();

    res.status(201).json({ appointment });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = { createAppointment, getAppointments };
