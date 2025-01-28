const express = require("express");
const { getAppointments, createAppointment, deleteAppointment, getPatientAppointments, markAppointmentAsVisited} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAppointments);
router.delete("/:id", authMiddleware, deleteAppointment);
router.post("/", authMiddleware, createAppointment);
router.get("/patient", authMiddleware, getPatientAppointments);
router.put('/:id/visited', authMiddleware, markAppointmentAsVisited);

module.exports = router;