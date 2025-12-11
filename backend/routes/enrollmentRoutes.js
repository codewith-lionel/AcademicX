const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { protect, authorize } = require("../middleware/auth");

// Student routes
router.post("/", protect, enrollmentController.enrollStudent);
router.get(
  "/student/:studentId",
  protect,
  enrollmentController.getStudentEnrollments
);
router.get(
  "/student/:studentId/gpa",
  protect,
  enrollmentController.getStudentGPA
);
router.delete("/:id", protect, enrollmentController.dropEnrollment);

// Admin routes
router.get(
  "/course/:courseId",
  protect,
  authorize("admin", "superadmin"),
  enrollmentController.getCourseEnrollments
);
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  enrollmentController.updateEnrollment
);

module.exports = router;
