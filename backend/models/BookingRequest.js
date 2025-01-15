const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  healthIssue: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming doctors are stored in the User model
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming patients are stored in the User model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("BookingRequest", bookingRequestSchema);
