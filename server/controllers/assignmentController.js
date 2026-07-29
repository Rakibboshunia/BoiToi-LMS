const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Course = require("../models/Course");

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private (Teacher only)
exports.createAssignment = async (req, res, next) => {
  try {
    req.body.teacher = req.user.id;
    
    // Ensure course belongs to teacher
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }
    
    if (course.teacher.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    const assignment = await Assignment.create(req.body);

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
exports.getAssignmentsForCourse = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId }).sort("dueDate");
    
    // If student, attach their submission status if exists
    if (req.user.role === "student") {
       const assignmentsWithStatus = await Promise.all(assignments.map(async (assignment) => {
          const submission = await Submission.findOne({ assignment: assignment._id, student: req.user.id });
          return {
             ...assignment.toObject(),
             submissionStatus: submission ? submission.status : 'pending',
             submissionGrade: submission ? submission.grade : null,
          };
       }));
       return res.status(200).json({ success: true, data: assignmentsWithStatus });
    }

    res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit assignment (Student)
// @route   POST /api/assignments/:id/submit
// @access  Private (Student only)
exports.submitAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
        return res.status(404).json({ success: false, error: "Assignment not found" });
    }

    // Check if already submitted
    let submission = await Submission.findOne({ assignment: req.params.id, student: req.user.id });
    
    const isLate = Date.now() > new Date(assignment.dueDate).getTime();
    
    if (submission) {
       // Update existing submission
       submission.content = req.body.content || submission.content;
       submission.attachments = req.body.attachments || submission.attachments;
       submission.submittedAt = Date.now();
       submission.status = isLate ? "late" : "resubmitted";
       await submission.save();
    } else {
       // Create new submission
       submission = await Submission.create({
          assignment: req.params.id,
          student: req.user.id,
          content: req.body.content,
          attachments: req.body.attachments,
          status: isLate ? "late" : "submitted"
       });
    }

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Grade submission (Teacher)
// @route   PUT /api/submissions/:id/grade
// @access  Private (Teacher only)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findById(req.params.id).populate("assignment");
    
    if (!submission) {
        return res.status(404).json({ success: false, error: "Submission not found" });
    }
    
    if (submission.assignment.teacher.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ success: false, error: "Not authorized to grade this assignment" });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = "graded";
    submission.gradedAt = Date.now();
    submission.gradedBy = req.user.id;
    
    await submission.save();
    
    // Notify student via socket
    req.io.to(submission.student.toString()).emit("assignment_graded", {
       assignmentTitle: submission.assignment.title,
       grade: submission.grade,
    });

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};
