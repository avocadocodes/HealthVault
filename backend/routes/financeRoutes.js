const express = require("express");
const { getPayments, addPayment, getPendingPayments, completePayment} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/payments", authMiddleware, getPayments);
router.post("/payments", authMiddleware, addPayment);
router.get("/pending-payments", authMiddleware, getPendingPayments); 
router.put("/complete-payment/:id", authMiddleware, completePayment); 

module.exports = router;
