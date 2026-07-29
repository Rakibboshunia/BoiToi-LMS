const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    gateway: {
      type: String,
      enum: ["stripe", "sslcommerz", "bkash", "free"],
      default: "stripe",
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripeSessionId: {
      type: String,
    },
    stripePaymentIntentId: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
    refundReason: {
      type: String,
    },
    // Teacher earnings after platform fee
    teacherEarnings: {
      type: Number,
      default: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
