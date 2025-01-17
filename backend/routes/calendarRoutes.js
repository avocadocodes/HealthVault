const express = require("express");
const router = express.Router();

// Dummy calendar events data (replace with database queries if needed)
const calendarEvents = [
  {
    title: "Surgery with John Doe",
    start: "2025-01-15T10:00:00Z",
    end: "2025-01-15T12:00:00Z",
  },
  {
    title: "Follow-up with Jane Smith",
    start: "2025-01-16T14:00:00Z",
    end: "2025-01-16T15:00:00Z",
  },
];

// Get all calendar events
router.get("/", (req, res) => {
  res.status(200).json(calendarEvents);
});

module.exports = router;