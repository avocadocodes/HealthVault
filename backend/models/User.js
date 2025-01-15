
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["doctor", "admin", "patient"], required: true },
  specialty: {
    type: String,
    required: function () {
      return this.role === "doctor"; 
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
                