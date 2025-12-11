const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const { protect, authorize } = require("../middleware/auth");

// Student routes
router.get("/student", protect, assignmentController.getStudentAssignments);
router.post("/:id/submit", protect, assignmentController.submitAssignment);

// Common routes
router.get("/", protect, assignmentController.getAllAssignments);
router.get("/:id", protect, assignmentController.getAssignmentById);

// Admin routes
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  assignmentController.createAssignment
);
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  assignmentController.updateAssignment
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  assignmentController.deleteAssignment
);
router.put(
  "/:id/submissions/:submissionId/grade",
  protect,
  authorize("admin", "superadmin"),
  assignmentController.gradeSubmission
);

module.exports = router;
