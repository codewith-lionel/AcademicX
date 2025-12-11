const express = require("express");
const router = express.Router();
const marksController = require("../controllers/marksController");
const { protect, authorize } = require("../middleware/auth");

// Student routes
router.get("/student/:studentId", protect, marksController.getStudentMarks);
router.get("/student/:studentId/gpa", protect, marksController.getStudentGPA);
router.get(
  "/student/:studentId/gradecard/:semester",
  protect,
  marksController.getSemesterGradeCard
);

// Admin routes
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  marksController.enterMarks
);
router.post(
  "/bulk",
  protect,
  authorize("admin", "superadmin"),
  marksController.bulkEnterMarks
);
router.get(
  "/course/:courseId",
  protect,
  authorize("admin", "superadmin"),
  marksController.getCourseMarks
);
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  marksController.updateMarks
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  marksController.deleteMarks
);

module.exports = router;
