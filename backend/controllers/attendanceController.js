const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private (Admin)
exports.markAttendance = async (req, res) => {
  try {
    const {
      course,
      semester,
      date,
      topic,
      sessionType,
      duration,
      records,
      academicYear,
    } = req.body;

    const attendance = await Attendance.create({
      course,
      semester,
      date,
      topic,
      sessionType: sessionType || "lecture",
      duration: duration || 1,
      records,
      markedBy: req.user._id,
      academicYear,
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("course")
      .populate("records.student", "name rollNumber")
      .populate("markedBy", "name");

    // Update enrollment attendance percentages
    for (const record of records) {
      const percentage = await Attendance.getStudentAttendancePercentage(
        record.student,
        course,
        semester
      );

      await Enrollment.findOneAndUpdate(
        { student: record.student, course, semester },
        { attendancePercentage: percentage }
      );
    }

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// @desc    Get attendance by course
// @route   GET /api/attendance/course/:courseId
// @access  Private
exports.getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { semester, startDate, endDate } = req.query;

    const query = { course: courseId };
    if (semester) query.semester = semester;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendances = await Attendance.find(query)
      .populate("course")
      .populate("records.student", "name rollNumber")
      .populate("markedBy", "name")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendances.length,
      attendances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// @desc    Get student attendance
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;
    const { course, semester } = req.query;

    const query = { "records.student": studentId };
    if (course) query.course = course;
    if (semester) query.semester = semester;

    const attendances = await Attendance.find(query)
      .populate("course")
      .populate("markedBy", "name")
      .sort({ date: -1 });

    // Filter to only include the student's records and calculate stats
    const studentAttendances = attendances.map((attendance) => {
      const studentRecord = attendance.records.find(
        (r) => r.student._id.toString() === studentId.toString()
      );

      return {
        _id: attendance._id,
        course: attendance.course,
        date: attendance.date,
        topic: attendance.topic,
        sessionType: attendance.sessionType,
        duration: attendance.duration,
        status: studentRecord ? studentRecord.status : "absent",
        remarks: studentRecord ? studentRecord.remarks : "",
      };
    });

    // Calculate overall attendance percentage
    const totalClasses = studentAttendances.length;
    const presentCount = studentAttendances.filter(
      (a) => a.status === "present" || a.status === "late"
    ).length;
    const attendancePercentage =
      totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

    res.status(200).json({
      success: true,
      count: studentAttendances.length,
      attendancePercentage: attendancePercentage.toFixed(2),
      attendances: studentAttendances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student attendance",
      error: error.message,
    });
  }
};

// @desc    Get student attendance by course
// @route   GET /api/attendance/student/:studentId/course/:courseId
// @access  Private
exports.getStudentCourseAttendance = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const { semester } = req.query;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const currentSemester = semester || student.semester;

    const attendances = await Attendance.find({
      course: courseId,
      semester: currentSemester,
      "records.student": studentId,
    })
      .populate("course")
      .sort({ date: -1 });

    const studentAttendances = attendances.map((attendance) => {
      const studentRecord = attendance.records.find(
        (r) => r.student.toString() === studentId.toString()
      );

      return {
        _id: attendance._id,
        date: attendance.date,
        topic: attendance.topic,
        sessionType: attendance.sessionType,
        duration: attendance.duration,
        status: studentRecord ? studentRecord.status : "absent",
        remarks: studentRecord ? studentRecord.remarks : "",
      };
    });

    const percentage = await Attendance.getStudentAttendancePercentage(
      studentId,
      courseId,
      currentSemester
    );

    res.status(200).json({
      success: true,
      count: studentAttendances.length,
      attendancePercentage: percentage.toFixed(2),
      course: attendances[0]?.course,
      attendances: studentAttendances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student course attendance",
      error: error.message,
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Admin)
exports.updateAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    if (records) {
      attendance.records = records;
    }

    await attendance.save();

    // Update enrollment attendance percentages
    for (const record of records) {
      const percentage = await Attendance.getStudentAttendancePercentage(
        record.student,
        attendance.course,
        attendance.semester
      );

      await Enrollment.findOneAndUpdate(
        {
          student: record.student,
          course: attendance.course,
          semester: attendance.semester,
        },
        { attendancePercentage: percentage }
      );
    }

    const updatedAttendance = await Attendance.findById(req.params.id)
      .populate("course")
      .populate("records.student", "name rollNumber")
      .populate("markedBy", "name");

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin)
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    attendance.isActive = false;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete attendance",
      error: error.message,
    });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats/:courseId
// @access  Private (Admin)
exports.getAttendanceStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { semester } = req.query;

    const enrollments = await Enrollment.find({
      course: courseId,
      semester,
      status: "active",
    }).populate("student", "name rollNumber");

    const stats = await Promise.all(
      enrollments.map(async (enrollment) => {
        const percentage = await Attendance.getStudentAttendancePercentage(
          enrollment.student._id,
          courseId,
          semester
        );

        return {
          student: enrollment.student,
          attendancePercentage: percentage.toFixed(2),
        };
      })
    );

    // Sort by attendance percentage
    stats.sort((a, b) => b.attendancePercentage - a.attendancePercentage);

    res.status(200).json({
      success: true,
      count: stats.length,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance statistics",
      error: error.message,
    });
  }
};

module.exports = exports;
