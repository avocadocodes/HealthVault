const express = require("express");
const CalendarEvent = require("../models/CalendarEvent");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get all calendar events for the logged-in doctor
router.get("/", authMiddleware, async (req, res) => {
  try {
      const doctorId = req.user.id; // Ensure only the logged-in doctor's events are fetched
      const events = await CalendarEvent.find({ doctorId });
      res.status(200).json(events);
  } catch (err) {
      console.error("Error fetching calendar events:", err);
      res.status(500).json({ error: "Failed to fetch calendar events." });
  }
});

module.exports = router;