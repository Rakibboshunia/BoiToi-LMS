const express = require("express");
const { getStudentDashboardStats } = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All student routes are protected and only accessible to students
router.use(protect, authorize("student"));

router.get("/dashboard", getStudentDashboardStats);

module.exports = router;
