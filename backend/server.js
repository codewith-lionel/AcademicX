const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database"); // Changed from './config/db'
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration - Allow frontend, admin, and student app
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || "http://localhost:3000",
    process.env.ADMIN_URL || "http://localhost:3001",
    process.env.STUDENT_URL || "http://localhost:3002",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parser middleware with appropriate limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CS Department API is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      faculty: "/api/faculty",
      courses: "/api/courses",
      studyMaterials: "/api/study-materials",
      events: "/api/events",
      gallery: "/api/gallery",
    },
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes")); // Authentication routes
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/study-materials", require("./routes/studyMaterialRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/achievements", require("./routes/achievementRoutes"));

// Only include courses route if it exists
try {
  app.use("/api/courses", require("./routes/courseRoutes"));
} catch (err) {
  console.log("⚠️  Courses route not found - skipping");
}

// 404 handler - Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      timestamp: new Date().toISOString(),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
      timestamp: new Date().toISOString(),
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 CS DEPARTMENT API SERVER");
  console.log("=".repeat(50));
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Server running on: http://localhost:${PORT}`);
  console.log(
    `💾 MongoDB: ${
      process.env.MONGO_URI || process.env.MONGODB_URI
        ? "Connected"
        : "Not configured"
    }`
  );
  console.log("=".repeat(50));
  console.log("\n📍 Available Routes:");
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   *    http://localhost:${PORT}/api/faculty`);
  console.log(`   *    http://localhost:${PORT}/api/study-materials`);
  console.log(`   *    http://localhost:${PORT}/api/events`);
  console.log(`   *    http://localhost:${PORT}/api/gallery`);
  console.log("=".repeat(50) + "\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

module.exports = app;
