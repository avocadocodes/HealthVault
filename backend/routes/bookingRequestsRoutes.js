const express = require("express");
const {
  getBookingRequests,
  approveBookingRequest,
  deleteBookingRequest,
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
router.delete("/:id", authMiddleware, deleteBookingRequest);


module.exports = router;