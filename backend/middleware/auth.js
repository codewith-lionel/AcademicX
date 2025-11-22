const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Protect routes - verify JWT token (works for both students and admins)
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check role and find user
    if (decoded.role === "admin" || decoded.role === "superadmin") {
      req.user = await Admin.findById(decoded.id);
    } else {
      req.user = await Student.findById(decoded.id);
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Verify admin registration key
exports.verifyAdminRegistrationKey = (req, res, next) => {
  const registrationKey =
    req.body.registrationKey || req.headers["x-registration-key"];
  const ADMIN_REGISTRATION_KEY =
    process.env.ADMIN_REGISTRATION_KEY || "SUPER_SECRET_ADMIN_KEY_2024";

  if (registrationKey !== ADMIN_REGISTRATION_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid admin registration key. Contact system administrator.",
    });
  }

  next();
};
