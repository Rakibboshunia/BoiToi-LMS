const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["video", "text", "pdf", "quiz", "live"],
      default: "video",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    videoPublicId: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 0, // in minutes
    },
    content: {
      type: String,
      default: "", // for text lessons
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ["pdf", "link", "code", "other"],
        },
      },
    ],
    isFreePreview: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);
