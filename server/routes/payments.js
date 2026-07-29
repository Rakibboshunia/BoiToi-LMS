const express = require("express");
const { initiatePayment, paymentSuccess, getMyPayments } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/my", protect, authorize("student"), getMyPayments);
router.post("/initiate", protect, authorize("student"), initiatePayment);
router.post("/success", paymentSuccess); // Public – called by payment gateway

module.exports = router;
