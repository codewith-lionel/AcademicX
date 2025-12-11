const Marks = require("../models/Marks");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");

// @desc    Enter marks
// @route   POST /api/marks
// @access  Private (Admin)
exports.enterMarks = async (req, res) => {
  try {
    const {
      student,
      course,
      semester,
      academicYear,
      examType,
      maxMarks,
      marksObtained,
      remarks,
    } = req.body;

    // Check if marks already exist
    const existingMarks = await Marks.findOne({
      student,
      course,
      semester,
      examType,
    });

    if (existingMarks) {
      return res.status(400).json({
        success: false,
        message: "Marks already entered for this exam",
      });
    }

    const marks = await Marks.create({
      student,
      course,
      semester,
      academicYear,
      examType,
      maxMarks,
      marksObtained,
      remarks: remarks || "",
      enteredBy: req.user._id,
    });

    const populatedMarks = await Marks.findById(marks._id)
      .populate("student", "name rollNumber")
      .populate("course")
      .populate("enteredBy", "name");

    res.status(201).json({
      success: true,
      message: "Marks entered successfully",
      marks: populatedMarks,
    });
  } catch (error) {
    console.error("Enter marks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enter marks",
      error: error.message,
    });
  }
};

// @desc    Get student marks
// @route   GET /api/marks/student/:studentId
// @access  Private
exports.getStudentMarks = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const { course, semester, examType } = req.query;

    const query = { student: studentId };
    if (course) query.course = course;
    if (semester) query.semester = semester;
    if (examType) query.examType = examType;

    const marks = await Marks.find(query)
      .populate("course")
      .populate("enteredBy", "name")
      .sort({ semester: -1, examType: 1 });

    res.status(200).json({
      success: true,
      count: marks.length,
      marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student marks",
      error: error.message,
    });
  }
};

// @desc    Get course marks
// @route   GET /api/marks/course/:courseId
// @access  Private (Admin)
exports.getCourseMarks = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { semester, examType } = req.query;

    const query = { course: courseId };
    if (semester) query.semester = semester;
    if (examType) query.examType = examType;

    const marks = await Marks.find(query)
      .populate("student", "name rollNumber")
      .populate("enteredBy", "name")
      .sort({ "student.rollNumber": 1 });

    res.status(200).json({
      success: true,
      count: marks.length,
      marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course marks",
      error: error.message,
    });
  }
};

// @desc    Update marks
// @route   PUT /api/marks/:id
// @access  Private (Admin)
exports.updateMarks = async (req, res) => {
  try {
    const { marksObtained, remarks } = req.body;

    const marks = await Marks.findById(req.params.id);

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: "Marks record not found",
      });
    }

    if (marksObtained !== undefined) marks.marksObtained = marksObtained;
    if (remarks !== undefined) marks.remarks = remarks;

    await marks.save();

    const updatedMarks = await Marks.findById(req.params.id)
      .populate("student", "name rollNumber")
      .populate("course")
      .populate("enteredBy", "name");

    res.status(200).json({
      success: true,
      message: "Marks updated successfully",
      marks: updatedMarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update marks",
      error: error.message,
    });
  }
};

// @desc    Delete marks
// @route   DELETE /api/marks/:id
// @access  Private (Admin)
exports.deleteMarks = async (req, res) => {
  try {
    const marks = await Marks.findById(req.params.id);

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: "Marks record not found",
      });
    }

    marks.isActive = false;
    await marks.save();

    res.status(200).json({
      success: true,
      message: "Marks deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete marks",
      error: error.message,
    });
  }
};

// @desc    Get student GPA/CGPA
// @route   GET /api/marks/student/:studentId/gpa
// @access  Private
exports.getStudentGPA = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;

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

    // Get semester-wise GPA
    const semesterGPAs = [];
    for (let sem = 1; sem <= student.semester; sem++) {
      const gpa = await Marks.calculateSemesterGPA(studentId, sem);
      semesterGPAs.push({
        semester: sem,
        gpa: parseFloat(gpa),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        studentId,
        currentSemester: student.semester,
        cgpa: parseFloat(cgpa),
        currentSemesterGPA: parseFloat(currentSemesterGPA),
        semesterWiseGPA: semesterGPAs,
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

// @desc    Get semester grade card
// @route   GET /api/marks/student/:studentId/gradecard/:semester
// @access  Private
exports.getSemesterGradeCard = async (req, res) => {
  try {
    const { studentId, semester } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get enrollments for the semester
    const enrollments = await Enrollment.find({
      student: studentId,
      semester: parseInt(semester),
    })
      .populate("course")
      .sort({ "course.courseCode": 1 });

    // Get marks for each course
    const gradeCard = await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseMarks = await Marks.find({
          student: studentId,
          course: enrollment.course._id,
          semester: parseInt(semester),
        });

        return {
          course: enrollment.course,
          enrollment: {
            grade: enrollment.grade,
            gradePoints: enrollment.gradePoints,
            attendancePercentage: enrollment.attendancePercentage,
            status: enrollment.status,
          },
          marks: courseMarks,
        };
      })
    );

    const semesterGPA = await Marks.calculateSemesterGPA(
      studentId,
      parseInt(semester)
    );
    const cgpa = await Marks.calculateCGPA(studentId, parseInt(semester));

    res.status(200).json({
      success: true,
      data: {
        student: {
          name: student.name,
          rollNumber: student.rollNumber,
          department: student.department,
        },
        semester: parseInt(semester),
        gradeCard,
        semesterGPA: parseFloat(semesterGPA),
        cgpa: parseFloat(cgpa),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate grade card",
      error: error.message,
    });
  }
};

// @desc    Bulk enter marks
// @route   POST /api/marks/bulk
// @access  Private (Admin)
exports.bulkEnterMarks = async (req, res) => {
  try {
    const { marksData } = req.body; // Array of marks objects

    const results = {
      success: [],
      failed: [],
    };

    for (const markData of marksData) {
      try {
        // Check if marks already exist
        const existingMarks = await Marks.findOne({
          student: markData.student,
          course: markData.course,
          semester: markData.semester,
          examType: markData.examType,
        });

        if (existingMarks) {
          results.failed.push({
            student: markData.student,
            reason: "Marks already exist",
          });
          continue;
        }

        const marks = await Marks.create({
          ...markData,
          enteredBy: req.user._id,
        });

        results.success.push(marks._id);
      } catch (error) {
        results.failed.push({
          student: markData.student,
          reason: error.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Bulk marks entry completed: ${results.success.length} successful, ${results.failed.length} failed`,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk marks entry failed",
      error: error.message,
    });
  }
};

module.exports = exports;
