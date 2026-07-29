const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  createModule,
  createLesson,
} = require("../controllers/courseController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(getCourses)
  .post(protect, authorize("teacher", "admin"), createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("teacher", "admin"), updateCourse);

router
  .route("/:courseId/modules")
  .post(protect, authorize("teacher", "admin"), createModule);

router
  .route("/modules/:moduleId/lessons")
  .post(protect, authorize("teacher", "admin"), createLesson);

module.exports = router;
