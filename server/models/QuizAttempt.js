const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        question: mongoose.Schema.Types.ObjectId,
        selectedOptions: [String],
        textAnswer: String,
        isCorrect: Boolean,
        pointsEarned: Number,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    timeTaken: {
      type: Number, // in seconds
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
