const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const certificateSchema = new mongoose.Schema(
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
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    verificationCode: {
      type: String,
      unique: true,
      default: () => uuidv4().replace(/-/g, "").toUpperCase().slice(0, 16),
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    pdfUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Certificate", certificateSchema);
