const Course = require("../models/Course");
const User = require("../models/User");

// @desc    Get teacher dashboard stats
// @route   GET /api/dashboard/teacher
// @access  Public (Temporary for testing)
exports.getTeacherDashboard = async (req, res, next) => {
  try {
    // In a real scenario, filter by req.user.id
    // For this testing phase, we'll aggregate all courses to show demo data
    const courses = await Course.find();
    
    const totalCourses = courses.length;
    
    // Simulate total students (sum of enrollmentCounts or random if not present)
    const totalStudents = courses.reduce((acc, course) => acc + (course.enrollmentCount || Math.floor(Math.random() * 20)), 0);
    
    // Simulate earnings
    const totalEarnings = courses.reduce((acc, course) => {
      const price = course.isFree ? 0 : (course.price || 49.99);
      const students = course.enrollmentCount || Math.floor(Math.random() * 20);
      return acc + (price * students);
    }, 0);
    
    // Simulate avg rating
    const avgRating = 4.8;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCourses,
          totalStudents,
          totalEarnings,
          avgRating
        },
        recentActivity: [
          { message: "New student enrolled in Advanced Web Dev", time: "2 hours ago" },
          { message: "You received a 5-star review", time: "5 hours ago" }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student
// @access  Public (Temporary for testing)
exports.getStudentDashboard = async (req, res, next) => {
  try {
    // Fetch some published courses to simulate enrolled courses
    const courses = await Course.find({ isPublished: true }).limit(4);
    
    const enrolledCourses = courses.map(c => ({
      _id: c._id,
      title: c.title,
      thumbnail: c.thumbnail,
      category: c.category,
      instructor: "Demo Instructor",
      progress: Math.floor(Math.random() * 80) + 10 // Random progress 10-90%
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          enrolled: enrolledCourses.length,
          completed: 1,
          liveClasses: 2,
          hoursLearned: 45
        },
        enrolledCourses
      }
    });
  } catch (err) {
    next(err);
  }
};
