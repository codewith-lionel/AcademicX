const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const TokenBlacklist = require("../models/TokenBlacklist");

// Ensure environment variable exists
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// -------------------------
//  Generate Tokens
// -------------------------
exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" } // short expiry for security
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// -------------------------
//  Protect Route
// -------------------------
exports.protect = async (req, res, next) => {
  let token;

  // Extract token
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Access denied.",
    });
  }

  try {
    // Check if token is blacklisted (logged out)
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // Verify access token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Identify user type
    let user = null;

    if (decoded.role === "admin" || decoded.role === "superadmin") {
      user = await Admin.findById(decoded.id).select("-password");
    } else {
      user = await Student.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// -------------------------
//  Authorize Roles
// -------------------------
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role '${req.user.role}'`,
      });
    }
    next();
  };
};

// -------------------------
//  Refresh Token Handler
// -------------------------
exports.refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    let user;

    if (decoded.role === "admin" || decoded.role === "superadmin") {
      user = await Admin.findById(decoded.id);
    } else {
      user = await Student.findById(decoded.id);
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = exports.generateAccessToken(user);

    return res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid",
    });
  }
};

// -------------------------
//  Logout - Blacklist Token
// -------------------------
exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ success: false, message: "Token missing" });
  }

  await TokenBlacklist.create({ token });

  return res.json({ success: true, message: "Logged out successfully" });
};

// -------------------------
//  Admin Registration Key
// -------------------------
exports.verifyAdminRegistrationKey = (req, res, next) => {
  const registrationKey =
    req.body.registrationKey || req.headers["x-registration-key"];

  if (!process.env.ADMIN_REGISTRATION_KEY) {
    throw new Error("ADMIN_REGISTRATION_KEY missing in environment");
  }

  if (registrationKey !== process.env.ADMIN_REGISTRATION_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid admin registration key",
    });
  }

  next();
};
