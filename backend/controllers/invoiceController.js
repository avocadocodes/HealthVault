const Invoice = require("../models/Invoice");
const jwt = require("jsonwebtoken");

exports.getInvoices = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const invoices = await Invoice.find({ user: decoded.id });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { clientName, items, totalAmount, status } = req.body;

    if (!clientName || !items || !totalAmount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newInvoice = new Invoice({
      user: decoded.id,
      clientName,
      items,
      totalAmount,
      status,
    });

    await newInvoice.save();
    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (err) {
    res.status(500).json({ error: "Failed to create invoice" });
  }
};
