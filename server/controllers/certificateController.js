const Certificate = require("../models/Certificate");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// @desc    Issue a certificate when a course is completed
// @route   POST /api/certificates
// @access  Private (Admin or system trigger)
exports.issueCertificate = async (req, res, next) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("student")
      .populate("course");

    if (!enrollment) {
      return res.status(404).json({ success: false, error: "Enrollment not found" });
    }

    if (enrollment.status !== "completed") {
      return res.status(400).json({ success: false, error: "Course not yet completed" });
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({
      student: enrollment.student._id,
      course: enrollment.course._id,
    });

    if (existing) {
      return res.status(400).json({ success: false, error: "Certificate already issued" });
    }

    const certificateId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;

    const certificate = await Certificate.create({
      student: enrollment.student._id,
      course: enrollment.course._id,
      certificateId,
      issuedAt: Date.now(),
    });

    res.status(201).json({ success: true, data: certificate });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all certificates for the logged-in student
// @route   GET /api/certificates/my
// @access  Private (Student)
exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .populate("course", "title thumbnail teacher")
      .sort("-issuedAt");

    res.status(200).json({ success: true, data: certificates });
  } catch (err) {
    next(err);
  }
};
