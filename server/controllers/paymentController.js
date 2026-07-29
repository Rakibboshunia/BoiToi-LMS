const Payment = require("../models/Payment");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// @desc    Initiate a payment (SSLCommerz / Stripe placeholder)
// @route   POST /api/payments/initiate
// @access  Private (Student)
exports.initiatePayment = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, error: "Already enrolled in this course" });
    }

    // For free courses, directly enroll
    if (course.isFree) {
      const enrollment = await Enrollment.create({
        student: req.user.id,
        course: courseId,
        status: "active",
      });
      return res.status(201).json({ success: true, data: enrollment, isFree: true });
    }

    // Create a pending payment record
    const payment = await Payment.create({
      student: req.user.id,
      course: courseId,
      amount: course.price,
      currency: "USD",
      status: "pending",
    });

    // In a real app, you would call SSLCommerz/Stripe here and return the
    // payment gateway URL. For now, we return a placeholder.
    res.status(201).json({
      success: true,
      data: payment,
      // gatewayUrl: sslcommerzSession.GatewayPageURL
      gatewayUrl: `/checkout/${courseId}?paymentId=${payment._id}&demo=true`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Payment success callback (SSLCommerz IPN or Stripe webhook)
// @route   POST /api/payments/success
// @access  Public (webhook)
exports.paymentSuccess = async (req, res, next) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }

    // Mark payment as completed
    payment.status = "completed";
    payment.transactionId = req.body.transactionId || `TXN-${Date.now()}`;
    await payment.save();

    // Create enrollment
    await Enrollment.create({
      student: payment.student,
      course: payment.course,
      status: "active",
      paymentId: payment._id,
    });

    res.status(200).json({ success: true, message: "Payment successful and enrollment created" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get payment history for student
// @route   GET /api/payments/my
// @access  Private (Student)
exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.user.id })
      .populate("course", "title thumbnail price")
      .sort("-createdAt");

    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};
