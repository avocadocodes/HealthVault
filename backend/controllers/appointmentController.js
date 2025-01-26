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
 const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user._id; 
    console.log("Fetching appointments for patient:", req.user._id);// Logged-in user's ID from middleware
    const appointments = await Appointment.find({ patientId }).populate("doctorId", "name");
    console.log("Fetched appointments:", appointments);
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { createAppointment, getAppointments, deleteAppointment, getPatientAppointments};
