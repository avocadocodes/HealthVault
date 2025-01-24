const BookingRequest = require("../models/BookingRequest");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");

// Fetch booking requests for a doctor
exports.getBookingRequests = async (req, res) => {
  try {
    const doctorId = req.user.id; // Ensure req.user.id is extracted correctly from token
    const requests = await BookingRequest.find({ doctorId, status: "pending" });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Failed to fetch booking requests:", err);
    res.status(500).json({ error: "Failed to fetch booking requests." });
  }
};

// Create a new booking request (from patient)
exports.createBookingRequest = async (req, res) => {
  try {
    console.log("Request body received:", req.body); 
    console.log("User from token:", req.user); 

    const { patientName, healthIssue, doctorId, date, time } = req.body;
    const doctorObjectId = mongoose.Types.ObjectId(doctorId);

    // Check if the required fields are present
    if (!patientName || !healthIssue || !doctorId || !date || !time) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if the requested time slot is available
    const isSlotTaken = await Appointment.findOne({ doctorId, date, time });
    console.log("Slot taken:", isSlotTaken);
    if (isSlotTaken) {
      return res.status(400).json({ error: "Requested time slot is already booked." });
    }

    const newRequest = new BookingRequest({
      patientName,
      healthIssue,
      doctorId: doctorObjectId,
      patientId: req.user.id, 
      date,
      time,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error in createBookingRequest:", err.message);
    res.status(500).json({ error: "Failed to create booking request." });
  }
};


// Approve a booking request
exports.approveBookingRequest = async (req, res) => {
  try {
    const bookingRequestId = req.params.id;

    // Find the booking request
    const bookingRequest = await BookingRequest.findById(bookingRequestId);
    if (!bookingRequest) {
      return res.status(404).json({ error: "Booking request not found" });
    }

    // Save the approved appointment
    const appointment = new Appointment({
      doctorId: bookingRequest.doctorId,
      patientId: bookingRequest.patientId,
      patientName: bookingRequest.patientName,
      healthIssue: bookingRequest.healthIssue,
      date: bookingRequest.date,
      time: bookingRequest.time,
    });
    await appointment.save();

    // Update the status of the booking request
    bookingRequest.status = "approved";
    await bookingRequest.save();

    res.status(200).json({
      message: "Booking request approved and appointment created successfully",
      appointment,
    });
  } catch (err) {
    console.error("Error approving booking request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Reject a booking request
exports.deleteBookingRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid booking request ID" });
    }

    // Check if the booking request exists
    const bookingRequest = await BookingRequest.findById(id);
    if (!bookingRequest) {
      return res.status(404).json({ error: "Booking request not found" });
    }

    // Delete the booking request
    await BookingRequest.findByIdAndDelete(id);

    res.status(200).json({ message: "Booking request deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking request:", err);
    res.status(500).json({ error: "Server error" });
  }
};
