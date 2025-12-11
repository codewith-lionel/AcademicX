const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Student = require("../models/Student");

// @desc    Enroll student in a course
// @route   POST /api/enrollments
// @access  Private (Student or Admin)
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId, semester, academicYear } = req.body;
    const studentId =
      req.user.role === "student" ? req.user._id : req.body.studentId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      semester: semester,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course for this semester",
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      semester,
      academicYear,
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("course")
      .populate("student", "name email rollNumber");

    res.status(201).json({
      success: true,
      message: "Enrollment successful",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Enrollment failed",
      error: error.message,
    });
  }
};

// @desc    Get student enrollments
// @route   GET /api/enrollments/student/:studentId
// @access  Private
exports.getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const { semester, status } = req.query;

    const query = { student: studentId };
    if (semester) query.semester = semester;
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .populate("course")
      .sort({ semester: -1, enrollmentDate: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
      error: error.message,
    });
  }
};

// @desc    Get course enrollments
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Admin)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { semester } = req.query;

    const query = { course: courseId };
    if (semester) query.semester = semester;

    const enrollments = await Enrollment.find(query)
      .populate("student", "name email rollNumber semester department avatar")
      .sort({ "student.rollNumber": 1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course enrollments",
      error: error.message,
    });
  }
};

// @desc    Update enrollment (grade, status)
// @route   PUT /api/enrollments/:id
// @access  Private (Admin)
exports.updateEnrollment = async (req, res) => {
  try {
    const { grade, gradePoints, status, attendancePercentage } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (grade) enrollment.grade = grade;
    if (gradePoints !== undefined) enrollment.gradePoints = gradePoints;
    if (status) enrollment.status = status;
    if (attendancePercentage !== undefined)
      enrollment.attendancePercentage = attendancePercentage;

    // Calculate grade points if grade is provided
    if (grade) {
      enrollment.calculateGradePoints();
    }

    await enrollment.save();

    const updatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("course")
      .populate("student", "name email rollNumber");

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update enrollment",
      error: error.message,
    });
  }
};

// @desc    Drop enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private
exports.dropEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Check if student owns the enrollment
    if (
      req.user.role === "student" &&
      enrollment.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to drop this enrollment",
      });
    }

    enrollment.status = "dropped";
    enrollment.isActive = false;
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Enrollment dropped successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to drop enrollment",
      error: error.message,
    });
  }
};

// @desc    Get student CGPA and GPA
// @route   GET /api/enrollments/student/:studentId/gpa
// @access  Private
exports.getStudentGPA = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const Marks = require("../models/Marks");

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const cgpa = await Marks.calculateCGPA(studentId, student.semester);
    const currentSemesterGPA = await Marks.calculateSemesterGPA(
      studentId,
      student.semester
    );

    res.status(200).json({
      success: true,
      data: {
        cgpa: parseFloat(cgpa),
        currentSemesterGPA: parseFloat(currentSemesterGPA),
        semester: student.semester,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate GPA",
      error: error.message,
    });
  }
};

module.exports = exports;
