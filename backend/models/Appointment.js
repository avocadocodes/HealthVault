const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  // doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  // patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  patientName: { type: String, required: true },
  healthIssue: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
