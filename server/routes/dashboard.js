const express = require("express");
const {
  getTeacherDashboard,
  getStudentDashboard
} = require("../controllers/dashboardController");

const router = express.Router();

// Public routes for testing (as requested by user, Option B)
router.get("/teacher", getTeacherDashboard);
router.get("/student", getStudentDashboard);

module.exports = router;
