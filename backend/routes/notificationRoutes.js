const express = require("express");
const { getNotifications, markNotificationsAsSeen } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/mark-seen", authMiddleware, markNotificationsAsSeen);

module.exports = router;
