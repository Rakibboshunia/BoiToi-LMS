const express = require("express");
const {
  createQuiz,
  getQuizzesForCourse,
  getQuiz,
  submitAttempt,
} = require("../controllers/quizController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("teacher", "admin"), createQuiz);
router.get("/course/:courseId", getQuizzesForCourse);
router.get("/:id", getQuiz);
router.post("/:id/attempt", authorize("student"), submitAttempt);

module.exports = router;
