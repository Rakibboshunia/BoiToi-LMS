const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Course = require("../models/Course");

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private (Teacher only)
exports.createQuiz = async (req, res, next) => {
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

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
exports.getQuizzesForCourse = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    
    // If student, remove correct answers from payload
    if (req.user.role === "student") {
      const sanitizedQuizzes = quizzes.map(q => {
        const quizObj = q.toObject();
        quizObj.questions.forEach(question => {
          delete question.correctAnswer;
          question.options.forEach(opt => delete opt.isCorrect);
        });
        return quizObj;
      });
      return res.status(200).json({ success: true, data: sanitizedQuizzes });
    }

    res.status(200).json({ success: true, data: quizzes });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // If student, sanitize answers
    if (req.user.role === "student") {
      const quizObj = quiz.toObject();
      quizObj.questions.forEach(question => {
        delete question.correctAnswer;
        delete question.explanation; // Hide explanation until submitted
        question.options.forEach(opt => delete opt.isCorrect);
      });
      return res.status(200).json({ success: true, data: quizObj });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Private (Student only)
exports.submitAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });

    const studentAnswers = req.body.answers; // Array of { questionId, selectedOptions: [] }
    let score = 0;
    let totalPoints = 0;
    const gradedAnswers = [];

    // Grade each question
    quiz.questions.forEach((q) => {
      totalPoints += q.points;
      const studentAnswer = studentAnswers.find(a => a.questionId.toString() === q._id.toString());
      
      let isCorrect = false;
      let pointsEarned = 0;

      if (studentAnswer) {
        if (q.type === 'mcq' || q.type === 'true_false') {
          // Find the correct option text
          const correctOption = q.options.find(o => o.isCorrect);
          if (correctOption && studentAnswer.selectedOptions.includes(correctOption.text)) {
            isCorrect = true;
            pointsEarned = q.points;
            score += q.points;
          }
        }
        // Short answer logic could go here
      }

      gradedAnswers.push({
        question: q._id,
        selectedOptions: studentAnswer ? studentAnswer.selectedOptions : [],
        isCorrect,
        pointsEarned
      });
    });

    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= quiz.passMark;

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user.id,
      answers: gradedAnswers,
      score,
      totalPoints,
      percentage,
      passed,
      timeTaken: req.body.timeTaken,
      completedAt: Date.now()
    });

    res.status(201).json({
      success: true,
      data: attempt,
      feedback: quiz.showAnswers ? quiz.questions : null // only send full questions with answers if allowed
    });

  } catch (err) {
    next(err);
  }
};
