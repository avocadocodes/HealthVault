
const express = require("express");
const { getHealthData, addHealthData } = require("../controllers/healthDataController");
const router = express.Router();

router.get("/:patientId", getHealthData);
router.post("/", addHealthData);

module.exports = router;
                