const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true }, 
  inr: { type: Number, required: true },
  transactionId: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
