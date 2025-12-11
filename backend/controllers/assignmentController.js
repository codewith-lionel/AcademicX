const Assignment = require("../models/Assignment");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Admin)
exports.createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      course,
      semester,
      maxMarks,
      dueDate,
      allowLateSubmission,
      lateSubmissionDeadline,
      instructions,
      attachments,
    } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      course,
      semester,
      maxMarks,
      dueDate,
      allowLateSubmission,
      lateSubmissionDeadline,
      instructions,
      attachments: attachments || [],
      createdBy: req.user._id,
    });

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate("course")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment: populatedAssignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
      error: error.message,
    });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
exports.getAllAssignments = async (req, res) => {
  try {
    const { course, semester, status } = req.query;

    const query = { isActive: true };
    if (course) query.course = course;
    if (semester) query.semester = semester;

    const assignments = await Assignment.find(query)
      .populate("course")
      .populate("createdBy", "name")
      .sort({ dueDate: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
      error: error.message,
    });
  }
};

// @desc    Get student assignments
// @route   GET /api/assignments/student
// @access  Private (Student)
exports.getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { semester, status } = req.query;

    // Get student's enrolled courses
    const enrollments = await Enrollment.find({
      student: studentId,
      status: "active",
      ...(semester && { semester }),
    }).select("course");

    const courseIds = enrollments.map((e) => e.course);

    // Get assignments for enrolled courses
    const query = {
      course: { $in: courseIds },
      isActive: true,
    };

    const assignments = await Assignment.find(query)
      .populate("course")
      .populate("createdBy", "name")
      .sort({ dueDate: 1 });

    // Add submission status for each assignment
    const assignmentsWithStatus = assignments.map((assignment) => {
      const submission = assignment.getStudentSubmission(studentId);
      return {
        ...assignment.toObject(),
        submissionStatus: submission ? submission.status : "not-submitted",
        hasSubmitted: !!submission,
        submission: submission || null,
      };
    });

    res.status(200).json({
      success: true,
      count: assignmentsWithStatus.length,
      assignments: assignmentsWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student assignments",
      error: error.message,
    });
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("course")
      .populate("createdBy", "name email")
      .populate("submissions.student", "name email rollNumber")
      .populate("submissions.gradedBy", "name");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch assignment",
      error: error.message,
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const studentId = req.user._id;
    const { textContent, files } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: assignment.course,
      status: "active",
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Check if already submitted
    const existingSubmission = assignment.getStudentSubmission(studentId);
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "Assignment already submitted",
      });
    }

    // Check deadline
    const now = new Date();
    const isLate = assignment.isSubmissionLate(now);

    if (isLate && !assignment.allowLateSubmission) {
      return res.status(400).json({
        success: false,
        message: "Assignment deadline has passed",
      });
    }

    if (
      isLate &&
      assignment.allowLateSubmission &&
      now > assignment.lateSubmissionDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Late submission deadline has also passed",
      });
    }

    // Create submission
    const submission = {
      student: studentId,
      submittedAt: now,
      files: files || [],
      textContent: textContent || "",
      status: isLate ? "late" : "submitted",
    };

    assignment.submissions.push(submission);
    await assignment.save();

    const updatedAssignment = await Assignment.findById(assignmentId)
      .populate("course")
      .populate("submissions.student", "name email rollNumber");

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error("Submit assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit assignment",
      error: error.message,
    });
  }
};

// @desc    Grade assignment submission
// @route   PUT /api/assignments/:id/submissions/:submissionId/grade
// @access  Private (Admin)
exports.gradeSubmission = async (req, res) => {
  try {
    const { id: assignmentId, submissionId } = req.params;
    const { marks, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const submission = assignment.submissions.id(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (marks > assignment.maxMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks cannot exceed ${assignment.maxMarks}`,
      });
    }

    submission.marks = marks;
    submission.feedback = feedback || "";
    submission.status = "graded";
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();

    await assignment.save();

    const updatedAssignment = await Assignment.findById(assignmentId)
      .populate("course")
      .populate("submissions.student", "name email rollNumber")
      .populate("submissions.gradedBy", "name");

    res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to grade submission",
      error: error.message,
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Admin)
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("course")
      .populate("createdBy", "name");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update assignment",
      error: error.message,
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Admin)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    assignment.isActive = false;
    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete assignment",
      error: error.message,
    });
  }
};

module.exports = exports;
