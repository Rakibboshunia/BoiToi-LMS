const express = require("express");
const {
  getLiveClasses,
  scheduleLiveClass,
  updateLiveStatus,
} = require("../controllers/liveController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorize("teacher", "admin"), scheduleLiveClass);

router
  .route("/:courseId")
  .get(getLiveClasses);

router
  .route("/:id/status")
  .put(authorize("teacher", "admin"), updateLiveStatus);

module.exports = router;
