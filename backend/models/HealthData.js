
const mongoose = require("mongoose");

const healthDataSchema = mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  metricType: { type: String, required: true }, // e.g., "heart rate", "blood pressure"
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("HealthData", healthDataSchema);
                