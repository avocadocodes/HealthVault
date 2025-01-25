const express = require("express");
const { getDoctors, getUserDetails } = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/me", authMiddleware, getUserDetails);

module.exports = router;
