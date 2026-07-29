const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    attachments: [
      {
        title: String,
        url: String,
        publicId: String,
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["submitted", "late", "graded", "resubmitted"],
      default: "submitted",
    },
    grade: {
      type: Number,
      min: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
