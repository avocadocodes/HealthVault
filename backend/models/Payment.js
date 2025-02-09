const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, default: null }, 
  transactionId: { type: String,  unique: true, sparse:true, default: undefined },
  remarks: { type: String, default: ""}, 
  paymentStatus: { type: String, enum: ["Pending", "Completed"], required: true}
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
