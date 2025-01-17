const express = require("express");
const {
  getBookingRequests,
  approveBookingRequest,
  rejectBookingRequest,
  createBookingRequest,
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch all booking requests for a doctor
router.get("/", authMiddleware, getBookingRequests);

// Create a new booking request (from patient)
router.post("/", authMiddleware, createBookingRequest);

// Approve a booking request
router.put("/:id/approve", authMiddleware, approveBookingRequest);

// Reject a booking request
router.put("/:id/reject", authMiddleware, rejectBookingRequest);

module.exports = router;