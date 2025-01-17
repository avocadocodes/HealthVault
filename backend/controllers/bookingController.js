const BookingRequest = require("../models/BookingRequest");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// Fetch booking requests for a doctor
exports.getBookingRequests = async (req, res) => {
  try {
    const doctorId = req.user.id; // Assuming user ID is extracted from token
    const requests = await BookingRequest.find({ doctorId, status: "pending" });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booking requests." });
  }
};

// Create a new booking request (from patient)
exports.createBookingRequest = async (req, res) => {
  try {
    console.log("Request body received:", req.body); // Log the request payload
    console.log("User from token:", req.user); // Log the user object from the middleware

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
      patientId: req.user.id, // Patient ID from token
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
    const { id } = req.params;

    const request = await BookingRequest.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    console.log("Booking request approved:", request); // Log the approved booking
    

    if (!request) {
      return res.status(404).json({ error: "Booking request not found." });
    }

    // Create an appointment after approval
    const appointment = new Appointment({
      doctorId: request.doctorId,
      patientId: request.patientId,
      patientName: request.patientName,
      healthIssue: request.healthIssue,
      date: request.date,
      time: request.time,
    });

    await appointment.save();
    const notification = new Notification({
      userId: request.patientId,
      message: "Your booking request has been approved.",
      isSeen: false,
    });
    await notification.save();

    res.status(200).json({ message: "Booking request approved.", appointment });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve booking request." });
  }
};

// Reject a booking request
exports.rejectBookingRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BookingRequest.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: "Booking request not found." });
    }
    const notification = new Notification({
      userId: request.patientId,
      message: "Your booking request has been rejected. Try again later.",
      isSeen: false,
    });

    await notification.save();


    res.status(200).json({ message: "Booking request rejected." });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject booking request." });
  }
};