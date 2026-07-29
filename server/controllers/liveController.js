const LiveClass = require("../models/LiveClass");
const { v4: uuidv4 } = require("uuid");

// @desc    Get all live classes for a course
// @route   GET /api/live/:courseId
// @access  Private
exports.getLiveClasses = async (req, res, next) => {
  try {
    const liveClasses = await LiveClass.find({ course: req.params.courseId }).sort("scheduledAt");

    res.status(200).json({
      success: true,
      data: liveClasses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Schedule a new live class
// @route   POST /api/live
// @access  Private (Teacher only)
exports.scheduleLiveClass = async (req, res, next) => {
  try {
    req.body.teacher = req.user.id;
    // Generate a unique room ID for Jitsi/WebRTC
    req.body.roomId = `lms-room-${uuidv4().substring(0, 8)}`;

    const liveClass = await LiveClass.create(req.body);

    res.status(201).json({
      success: true,
      data: liveClass,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update live class status (start/end)
// @route   PUT /api/live/:id/status
// @access  Private (Teacher only)
exports.updateLiveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({ success: false, error: "Live class not found" });
    }

    if (liveClass.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    const updates = { status };
    if (status === "ongoing") updates.startedAt = Date.now();
    if (status === "completed") updates.endedAt = Date.now();

    liveClass = await LiveClass.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    
    // Emit socket event to notify students in the course
    req.io.to(`course_${liveClass.course}`).emit("live_class_status_changed", liveClass);

    res.status(200).json({
      success: true,
      data: liveClass,
    });
  } catch (err) {
    next(err);
  }
};
