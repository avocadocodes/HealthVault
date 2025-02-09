const express = require("express");
const {
  getBookingRequests,
  approveBookingRequest,
  deleteBookingRequest,
  createBookingRequest,
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getBookingRequests);
router.post("/", authMiddleware, createBookingRequest);
router.put("/:id/approve", authMiddleware, approveBookingRequest);
router.delete("/:id", authMiddleware, deleteBookingRequest);


module.exports = router;