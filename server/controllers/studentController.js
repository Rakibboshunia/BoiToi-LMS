const Enrollment = require("../models/Enrollment");
const LiveClass = require("../models/LiveClass");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Course = require("../models/Course");

// @desc    Get student dashboard statistics
// @route   GET /api/student/dashboard
// @access  Private/Student
exports.getStudentDashboardStats = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // 1. Get all enrollments for this student
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        select: "title thumbnail teacher level",
        populate: {
          path: "teacher",
          select: "name",
        },
      })
      .sort("-createdAt");

    const totalEnrolled = enrollments.length;

    // 2. Calculate completed courses
    const completedCourses = enrollments.filter(
      (enrollment) =>
        enrollment.progress === 100 || enrollment.status === "completed"
    ).length;

    // 3. Get upcoming live classes for enrolled courses (fix: scheduledAt not startTime)
    const courseIds = enrollments
      .filter((e) => e.course)
      .map((e) => e.course._id);

    const upcomingLiveClasses = await LiveClass.find({
      course: { $in: courseIds },
      scheduledAt: { $gte: new Date() },
      status: "scheduled",
    })
      .populate("course", "title")
      .sort("scheduledAt")
      .limit(5);

    // 4. Calculate total hours learned (rough estimate: 10hrs per 100% progress)
    let totalHoursLearned = 0;
    enrollments.forEach((e) => {
      totalHoursLearned += ((e.progress || 0) / 100) * 10;
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEnrolled,
          completedCourses,
          liveClassesCount: upcomingLiveClasses.length,
          hoursLearned: Math.round(totalHoursLearned * 10) / 10,
        },
        recentEnrollments: enrollments.slice(0, 4),
        upcomingLiveClasses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enrolled courses for the student
// @route   GET /api/student/courses
// @access  Private/Student
exports.getMyEnrolledCourses = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        select: "title thumbnail category level price isFree teacher",
        populate: {
          path: "teacher",
          select: "name avatar",
        },
      })
      .sort("-createdAt");

    const courses = enrollments
      .filter((e) => e.course) // filter out null courses
      .map((e) => ({
        _id: e.course._id,
        title: e.course.title,
        thumbnail: e.course.thumbnail,
        category: e.course.category,
        level: e.course.level,
        instructor: e.course.teacher?.name || "Unknown Instructor",
        progress: e.progress || 0,
        status: e.status,
        enrolledAt: e.createdAt,
        enrollmentId: e._id,
      }));

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all live classes across all enrolled courses
// @route   GET /api/student/live-classes
// @access  Private/Student
exports.getMyLiveClasses = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Get enrolled course IDs
    const enrollments = await Enrollment.find({ student: studentId }).select(
      "course"
    );
    const courseIds = enrollments.map((e) => e.course);

    // Get live classes for those courses
    const liveClasses = await LiveClass.find({ course: { $in: courseIds } })
      .populate("course", "title thumbnail")
      .populate("teacher", "name avatar")
      .sort("scheduledAt");

    res.status(200).json({ success: true, data: liveClasses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assignments across all enrolled courses with submission status
// @route   GET /api/student/assignments
// @access  Private/Student
exports.getMyAssignments = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Get enrolled course IDs
    const enrollments = await Enrollment.find({ student: studentId }).populate(
      "course",
      "title"
    );
    const courseIds = enrollments.map((e) => e.course?._id).filter(Boolean);

    // Get all assignments for those courses
    const assignments = await Assignment.find({
      course: { $in: courseIds },
    })
      .populate("course", "title")
      .sort("dueDate");

    // Attach submission status for each assignment
    const assignmentsWithStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          assignment: assignment._id,
          student: studentId,
        });
        return {
          ...assignment.toObject(),
          courseTitle: assignment.course?.title || "Unknown Course",
          submissionStatus: submission ? submission.status : "pending",
          submissionGrade: submission ? submission.grade : null,
        };
      })
    );

    res.status(200).json({ success: true, data: assignmentsWithStatus });
  } catch (error) {
    next(error);
  }
};
