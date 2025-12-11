const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/auth");

// Student routes
router.get(
  "/student/:studentId",
  protect,
  attendanceController.getStudentAttendance
);
router.get(
  "/student/:studentId/course/:courseId",
  protect,
  attendanceController.getStudentCourseAttendance
);

// Admin routes
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  attendanceController.markAttendance
);
router.get(
  "/course/:courseId",
  protect,
  authorize("admin", "superadmin"),
  attendanceController.getCourseAttendance
);
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  attendanceController.updateAttendance
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  attendanceController.deleteAttendance
);
router.get(
  "/stats/:courseId",
  protect,
  authorize("admin", "superadmin"),
  attendanceController.getAttendanceStats
);

module.exports = router;
