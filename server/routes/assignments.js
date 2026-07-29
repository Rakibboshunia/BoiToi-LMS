const express = require("express");
const {
  createAssignment,
  getAssignmentsForCourse,
  submitAssignment,
  gradeSubmission,
} = require("../controllers/assignmentController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("teacher", "admin"), createAssignment);
router.get("/course/:courseId", getAssignmentsForCourse);
router.post("/:id/submit", authorize("student"), submitAssignment);

// Submissions routing (for grading)
router.put("/submissions/:id/grade", authorize("teacher", "admin"), gradeSubmission);

module.exports = router;
