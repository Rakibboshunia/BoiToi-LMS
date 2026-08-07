const express = require("express");
const {
  getStudentDashboardStats,
  getMyEnrolledCourses,
  getMyLiveClasses,
  getMyAssignments,
} = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All student routes are protected and only accessible to students
router.use(protect, authorize("student"));

router.get("/dashboard", getStudentDashboardStats);
router.get("/courses", getMyEnrolledCourses);
router.get("/live-classes", getMyLiveClasses);
router.get("/assignments", getMyAssignments);

module.exports = router;
