const express = require("express");
const { getAppointments, bookAppointment } = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch all appointments for a logged-in user (patient or doctor)
router.get("/", authMiddleware, getAppointments);

// Book a new appointment (for patients)
router.post("/", authMiddleware, bookAppointment);

module.exports = router;
