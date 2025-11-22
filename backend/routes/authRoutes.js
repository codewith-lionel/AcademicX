const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// ========== STUDENT ROUTES ==========
// Public routes
router.post("/student/register", authController.registerStudent);
router.post("/student/login", authController.loginStudent);

// Protected routes
router.get("/student/me", protect, authController.getMe);
router.put("/students/profile", protect, authController.updateProfile);
router.put("/students/password", protect, authController.changePassword);

// ========== ADMIN ROUTES ==========
// Public routes (protected by registration key)
router.post("/admin/register", authController.registerAdmin);
router.post("/admin/login", authController.loginAdmin);

// Protected routes
router.get("/admin/me", protect, authController.getAdminMe);

module.exports = router;
