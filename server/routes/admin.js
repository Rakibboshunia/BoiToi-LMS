const express = require("express");
const { 
  getAdminStats, 
  getAllUsers, 
  getAllTeachers, 
  getAllCourses, 
  getAllPayments,
  toggleUserStatus,
  toggleTeacherApproval,
  toggleCourseStatus,
  deleteCourse
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All admin routes are protected and only accessible to admins
router.use(protect, authorize("admin"));

// GET routes for fetching data
router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/teachers", getAllTeachers);
router.get("/courses", getAllCourses);
router.get("/payments", getAllPayments);

// PUT/DELETE routes for actions
router.put("/users/:id/status", toggleUserStatus);
router.put("/teachers/:id/approve", toggleTeacherApproval);
router.put("/courses/:id/status", toggleCourseStatus);
router.delete("/courses/:id", deleteCourse);

module.exports = router;
