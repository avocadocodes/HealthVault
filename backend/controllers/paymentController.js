const Payment = require("../models/Payment");
const jwt = require("jsonwebtoken");
const mongoose =require("mongoose")
exports.getPayments = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const payments = await Payment.find({ user: decoded.id });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

exports.addPayment = async (req, res) => {
  try {
    console.log("Received Payment Data:", req.body);
    const { name, amount, type, transactionId, paymentStatus, remarks } = req.body;
    if (!name || !amount ||  !paymentStatus) {
      if(!name)console.log("hsdljfl")
      return res.status(400).json({ error: "All fields are required" });
    }
    if (paymentStatus === "Completed" && (!type || !transactionId)) {
      return res.status(400).json({ error: "Payment Type and Transaction ID are required for completed payments" });
    }
    const newPayment = new Payment({
      user: req.user.id,
      name,
      amount:Number(amount),
      type:paymentStatus === "Completed" ? type : undefined,
      transactionId: paymentStatus === "Completed" ? transactionId : undefined,
      remarks: remarks || "",
      paymentStatus,
    });
    await newPayment.save();
    res.status(201).json({ message: "Payment added successfully", payment: newPayment });
  } catch (err) {
    console.error("Error adding payment:", err);
    res.status(500).json({ error: "Failed to add payment" });
  }
};

exports.getPendingPayments = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pendingPayments = await Payment.find(
      { user: decoded.id, paymentStatus: "Pending"}, 
      "name amount remarks paymentStatus"
    );
    res.status(200).json(pendingPayments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending payments" });
  }
};

exports.completePayment = async (req, res) => {
  try {
    const { type, transactionId } = req.body;
    if (!type || !transactionId) {
      return res.status(400).json({ error: "Payment Type and Transaction ID are required" });
    }
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { type, transactionId, paymentStatus: "Completed" },
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json({ message: "Payment marked as completed", payment: updatedPayment });
  } catch (err) {
    res.status(500).json({ error: "Failed to complete payment" });
  }
};

