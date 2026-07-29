const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const { category, search, level } = req.query;
    
    let query = { isPublished: true, isApproved: true };
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const courses = await Course.find(query)
      .populate("teacher", "name avatar bio")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single course with modules & lessons
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name avatar bio")
      .populate({
        path: "modules",
        match: { isPublished: true },
        options: { sort: { order: 1 } },
        populate: {
          path: "lessons",
          match: { isPublished: true },
          options: { sort: { order: 1 } },
          select: "-videoUrl" // Hide videoUrl unless enrolled/preview
        }
      });

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Teacher only)
exports.createCourse = async (req, res, next) => {
  try {
    // Add teacher to req.body
    req.body.teacher = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher only)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    // Make sure user is course owner
    if (course.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not authorized to update this course" });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create module for course
// @route   POST /api/courses/:courseId/modules
// @access  Private (Teacher only)
exports.createModule = async (req, res, next) => {
  try {
    req.body.course = req.params.courseId;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    // Make sure user is course owner
    if (course.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not authorized to add module to this course" });
    }

    const module = await Module.create(req.body);
    
    // Add module to course
    course.modules.push(module._id);
    await course.save();

    res.status(201).json({
      success: true,
      data: module,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create lesson for module
// @route   POST /api/modules/:moduleId/lessons
// @access  Private (Teacher only)
exports.createLesson = async (req, res, next) => {
  try {
    req.body.module = req.params.moduleId;

    const module = await Module.findById(req.params.moduleId);

    if (!module) {
      return res.status(404).json({ success: false, error: "Module not found" });
    }

    const course = await Course.findById(module.course);

    // Make sure user is course owner
    if (course.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not authorized to add lesson" });
    }
    
    req.body.course = course._id;

    const lesson = await Lesson.create(req.body);
    
    // Add lesson to module
    module.lessons.push(lesson._id);
    await module.save();

    res.status(201).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    next(err);
  }
};
