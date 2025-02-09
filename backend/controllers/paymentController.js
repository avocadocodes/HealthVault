const Payment = require("../models/Payment");
const jwt = require("jsonwebtoken");

exports.getPayments = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const payments = await Payment.find({ user: decoded.id });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { name, amount, type, inr, transactionId } = req.body;

    if (!name || !amount || !type || !inr || !transactionId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newPayment = new Payment({
      user: decoded.id,
      name,
      amount,
      type,
      inr,
      transactionId,
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment added successfully", payment: newPayment });
  } catch (err) {
    res.status(500).json({ error: "Failed to add payment" });
  }
};
