const express = require("express");
const { getPayments, addPayment } = require("../controllers/paymentController");
const { getInvoices, createInvoice } = require("../controllers/invoiceController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Payments Routes
router.get("/payments", authMiddleware, getPayments);
router.post("/payments", authMiddleware, addPayment);

// Invoices Routes
router.get("/invoices", authMiddleware, getInvoices);
router.post("/invoices", authMiddleware, createInvoice);

module.exports = router;
