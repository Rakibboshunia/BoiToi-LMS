const Enrollment = require("../models/Enrollment");
const LiveClass = require("../models/LiveClass");
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
        select: "title thumbnail instructor level",
        populate: {
          path: "teacher",
          select: "name",
        },
      })
      .sort("-createdAt");

    const totalEnrolled = enrollments.length;
    
    // 2. Calculate completed courses
    const completedCourses = enrollments.filter(
      (enrollment) => enrollment.progress === 100 || enrollment.status === "completed"
    ).length;

    // 3. Get upcoming live classes for enrolled courses
    const courseIds = enrollments.map((e) => e.course._id);
    const upcomingLiveClasses = await LiveClass.find({
      course: { $in: courseIds },
      startTime: { $gte: new Date() },
      status: "scheduled",
    })
      .populate("course", "title")
      .sort("startTime")
      .limit(5);

    // 4. Calculate total hours learned
    // For now, let's mock it based on progress or use a static number if no lessons are tracked yet
    let totalHoursLearned = 0;
    enrollments.forEach(e => {
        // Roughly 10 hours per 100% progress for mock calculation
        totalHoursLearned += (e.progress / 100) * 10;
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEnrolled,
          completedCourses,
          liveClassesCount: upcomingLiveClasses.length,
          hoursLearned: Math.round(totalHoursLearned * 10) / 10, // Round to 1 decimal
        },
        recentEnrollments: enrollments.slice(0, 4), // Top 4 recent
        upcomingLiveClasses,
      },
    });
  } catch (error) {
    next(error);
  }
};
