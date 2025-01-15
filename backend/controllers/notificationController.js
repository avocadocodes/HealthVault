const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

exports.markNotificationsAsSeen = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isSeen: false }, { isSeen: true });
    res.status(200).json({ message: "Notifications marked as seen." });
  } catch (err) {
    console.error("Error marking notifications as seen:", err);
    res.status(500).json({ error: "Failed to mark notifications as seen." });
  }
};
