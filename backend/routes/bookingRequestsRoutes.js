const express = require("express");
const router = express.Router();

// Dummy booking requests data (replace with database queries if needed)
const bookingRequests = [
  { _id: "1", patientName: "John Doe", date: "2025-01-15T10:00:00Z" },
  { _id: "2", patientName: "Jane Smith", date: "2025-01-16T14:00:00Z" },
];

// Get all booking requests
router.get("/", (req, res) => {
  res.status(200).json(bookingRequests);
});

// Accept a booking request
router.post("/:id/accept", (req, res) => {
  res.status(200).json({ message: `Booking request ${req.params.id} accepted` });
});

// Reject a booking request
router.post("/:id/reject", (req, res) => {
  res.status(200).json({ message: `Booking request ${req.params.id} rejected` });
});

module.exports = router;
