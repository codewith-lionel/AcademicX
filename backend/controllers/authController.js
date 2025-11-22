const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRE = "30d";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// @desc    Register a new student
// @route   POST /api/auth/student/register
// @access  Public
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, rollNumber, semester, department } =
      req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message:
          existingStudent.email === email
            ? "Email already registered"
            : "Roll number already exists",
      });
    }

    // Create student
    const student = await Student.create({
      name,
      email,
      password,
      phone,
      rollNumber,
      semester,
      department,
    });

    // Generate token
    const token = generateToken(student._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        semester: student.semester,
        department: student.department,
        avatar: student.avatar,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// @desc    Login student
// @route   POST /api/auth/student/login
// @access  Public
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find student and include password
    const student = await Student.findOne({ email }).select("+password");

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is active
    if (!student.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact admin.",
      });
    }

    // Verify password
    const isPasswordMatch = await student.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(student._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        semester: student.semester,
        department: student.department,
        avatar: student.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// @desc    Get current logged-in student
// @route   GET /api/auth/student/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student data",
      error: error.message,
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ["name", "phone", "avatar"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const student = await Student.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/students/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current and new password",
      });
    }

    const student = await Student.findById(req.user.id).select("+password");

    const isMatch = await student.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    student.password = newPassword;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// ==================== ADMIN AUTHENTICATION ====================

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Find admin and include password
    const admin = await Admin.findOne({ username }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact super admin.",
      });
    }

    // Verify password
    const isPasswordMatch = await admin.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, "admin");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// @desc    Register a new admin (for initial setup)
// @route   POST /api/auth/admin/register
// @access  Protected (Requires registration key)
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password, name, registrationKey } = req.body;

    // Verify registration key
    const ADMIN_REGISTRATION_KEY =
      process.env.ADMIN_REGISTRATION_KEY ||
      "CHANGE_THIS_SECRET_KEY_IN_PRODUCTION";

    if (registrationKey !== ADMIN_REGISTRATION_KEY) {
      return res.status(403).json({
        success: false,
        message:
          "Invalid registration key. Contact system administrator for access.",
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message:
          existingAdmin.email === email
            ? "Email already registered"
            : "Username already exists",
      });
    }

    // Check if this is the first admin (make them superadmin)
    const adminCount = await Admin.countDocuments();
    const adminRole = adminCount === 0 ? "superadmin" : "admin";

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password,
      name,
      role: adminRole,
    });

    // Generate token
    const token = generateToken(admin._id, "admin");

    res.status(201).json({
      success: true,
      message: "Admin registration successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// @desc    Get current logged-in admin
// @route   GET /api/auth/admin/me
// @access  Private
exports.getAdminMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching admin data",
      error: error.message,
    });
  }
};
