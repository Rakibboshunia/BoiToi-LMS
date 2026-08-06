const User = require("../models/User");
const Course = require("../models/Course");

// @desc    Get basic admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    // Count users by role
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalUsers = await User.countDocuments();

    // Count courses
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });

    // Mock revenue or actual revenue if Payment model exists
    // (Skipping actual payment aggregation for this simple stats unless Payment is clearly modeled)
    const totalRevenue = 12500; // Mock revenue data

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          teachers: totalTeachers,
          admins: totalAdmins,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
        },
        revenue: {
          total: totalRevenue,
        }
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (students and admins)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $in: ["student", "admin"] } }).sort("-createdAt");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
exports.getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" }).sort("-createdAt");
    res.status(200).json({ success: true, count: teachers.length, data: teachers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private/Admin
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("teacher", "name email").sort("-createdAt");
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res, next) => {
  try {
    const Payment = require("../models/Payment"); // Lazy load or require at top
    const payments = await Payment.find()
      .populate("student", "name email")
      .populate("course", "title price")
      .sort("-createdAt");
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (activate/deactivate)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    // Prevent deactivating oneself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, error: "Cannot deactivate your own account" });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle teacher approval
// @route   PUT /api/admin/teachers/:id/approve
// @access  Private/Admin
exports.toggleTeacherApproval = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "teacher") return res.status(404).json({ success: false, error: "Teacher not found" });

    user.isApproved = !user.isApproved;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle course status (publish/unpublish)
// @route   PUT /api/admin/courses/:id/status
// @access  Private/Admin
exports.toggleCourseStatus = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, error: "Course not found" });

    course.isPublished = !course.isPublished;
    await course.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, error: "Course not found" });

    await course.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
