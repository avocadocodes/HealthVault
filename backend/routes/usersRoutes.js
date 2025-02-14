const express = require("express");
const { getDoctors, getUserDetails, getDoctorProfile, updateDoctorProfile, uploadProfilePic } = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');
const upload = require("../middlewares/multerConfig");

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/me", authMiddleware, getUserDetails);

router.get("/profile/:doctorId", isAuthenticated, getDoctorProfile);
router.put("/profile/:doctorId", isAuthenticated, updateDoctorProfile);
router.post("/profile/:doctorId/upload", isAuthenticated, upload.single("profilePic"), uploadProfilePic);

module.exports = router;
