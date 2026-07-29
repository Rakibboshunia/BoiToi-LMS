const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Live class title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, "Schedule time is required"],
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LiveClass", liveClassSchema);
