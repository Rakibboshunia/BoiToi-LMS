const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["mcq", "true_false", "short_answer"],
    default: "mcq",
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  correctAnswer: String, // for short_answer
  explanation: {
    type: String,
    default: "",
  },
  points: {
    type: Number,
    default: 1,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
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
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [questionSchema],
    timeLimit: {
      type: Number,
      default: 30, // in minutes, 0 = no limit
    },
    passMark: {
      type: Number,
      default: 70, // percentage
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    showAnswers: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("Quiz", quizSchema);
