const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// ========== ADMIN ROUTES ==========
// Public routes (protected by registration key)
router.post("/admin/register", authController.registerAdmin);
router.post("/admin/login", authController.loginAdmin);

// Protected routes
router.get("/admin/me", protect, authController.getAdminMe);

module.exports = router;
