const express = require("express");
const { getDoctors, getUserDetails, getDoctorProfile, updateDoctorProfile, uploadProfilePic } = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');
const upload = require("../utils/multer");

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/me", authMiddleware, getUserDetails);

router.get("/profile/:doctorId", authMiddleware, getDoctorProfile);
router.put("/profile/:doctorId", authMiddleware, updateDoctorProfile);
router.post("/profile/:doctorId/upload", authMiddleware, upload.single("profilePic"), uploadProfilePic);

module.exports = router;
