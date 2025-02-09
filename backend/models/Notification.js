const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to the patient or doctor
    message: { type: String, required: true }, // Notification message
    isSeen: { type: Boolean, default: false }, // Indicates if the notification has been seen
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Notification", notificationSchema);
