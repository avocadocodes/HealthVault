const express = require("express");
const { getAppointments, createAppointment, deleteAppointment} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch all appointments for a logged-in user (patient or doctor)
router.get("/", authMiddleware, getAppointments);

// Book a new appointment (for patients)
// router.post("/",   authMiddleware , bookAppointment);
router.delete("/:id", authMiddleware, deleteAppointment);

// Define the POST route
router.post("/", authMiddleware, createAppointment);
module.exports = router;