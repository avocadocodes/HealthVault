const express = require("express");
const {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientStats, 
    getPatientById,
  } = require("../controllers/patientController");

const router = express.Router();

router.get("/", getPatients);
router.get("/:id", getPatientById); 
router.post("/", createPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);
router.get("/stats", getPatientStats);

module.exports = router;
                