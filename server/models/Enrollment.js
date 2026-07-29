const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
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
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    progress: {
      type: Number,
      default: 0, // percentage 0-100
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    lastAccessedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    completedAt: {
      type: Date,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Unique enrollment per student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
