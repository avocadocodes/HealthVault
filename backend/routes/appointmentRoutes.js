const express = require("express");
const { getAppointments, createAppointment, deleteAppointment, getPatientAppointments} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAppointments);
router.delete("/:id", authMiddleware, deleteAppointment);
router.post("/", authMiddleware, createAppointment);
router.get("/patient", authMiddleware, getPatientAppointments);

module.exports = router;