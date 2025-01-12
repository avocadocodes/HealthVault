
const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  healthData: [{ type: mongoose.Schema.Types.ObjectId, ref: "HealthData" }],
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
                