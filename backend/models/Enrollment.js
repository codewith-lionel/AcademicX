const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    academicYear: {
      type: String,
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped", "failed"],
      default: "active",
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F", "I", "W", ""],
      default: "",
    },
    gradePoints: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    attendancePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a student can't enroll in the same course twice for the same semester
enrollmentSchema.index(
  { student: 1, course: 1, semester: 1 },
  { unique: true }
);

// Method to calculate grade points
enrollmentSchema.methods.calculateGradePoints = function () {
  const gradeMap = {
    "A+": 10,
    A: 9,
    "B+": 8,
    B: 7,
    "C+": 6,
    C: 5,
    D: 4,
    F: 0,
    I: 0,
    W: 0,
  };
  this.gradePoints = gradeMap[this.grade] || 0;
};

module.exports = mongoose.model("Enrollment", enrollmentSchema);
