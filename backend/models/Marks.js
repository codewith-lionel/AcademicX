const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
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
    examType: {
      type: String,
      enum: [
        "internal1",
        "internal2",
        "internal3",
        "assignment",
        "project",
        "final",
        "practical",
      ],
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F", ""],
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
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

// Compound index
marksSchema.index(
  { student: 1, course: 1, semester: 1, examType: 1 },
  { unique: true }
);

// Pre-save hook to calculate percentage and grade
marksSchema.pre("save", function (next) {
  // Calculate percentage
  this.percentage = (this.marksObtained / this.maxMarks) * 100;

  // Calculate grade
  if (this.percentage >= 90) this.grade = "A+";
  else if (this.percentage >= 80) this.grade = "A";
  else if (this.percentage >= 70) this.grade = "B+";
  else if (this.percentage >= 60) this.grade = "B";
  else if (this.percentage >= 50) this.grade = "C+";
  else if (this.percentage >= 40) this.grade = "C";
  else if (this.percentage >= 35) this.grade = "D";
  else this.grade = "F";

  next();
});

// Static method to calculate CGPA
marksSchema.statics.calculateCGPA = async function (studentId, semester) {
  const Enrollment = mongoose.model("Enrollment");

  const enrollments = await Enrollment.find({
    student: studentId,
    semester: { $lte: semester },
    status: { $in: ["active", "completed"] },
  }).populate("course");

  if (enrollments.length === 0) return 0;

  let totalCredits = 0;
  let totalGradePoints = 0;

  enrollments.forEach((enrollment) => {
    const credits = enrollment.course.credits || 3; // Default 3 credits
    totalCredits += credits;
    totalGradePoints += enrollment.gradePoints * credits;
  });

  return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
};

// Static method to calculate semester GPA
marksSchema.statics.calculateSemesterGPA = async function (
  studentId,
  semester
) {
  const Enrollment = mongoose.model("Enrollment");

  const enrollments = await Enrollment.find({
    student: studentId,
    semester: semester,
    status: { $in: ["active", "completed"] },
  }).populate("course");

  if (enrollments.length === 0) return 0;

  let totalCredits = 0;
  let totalGradePoints = 0;

  enrollments.forEach((enrollment) => {
    const credits = enrollment.course.credits || 3;
    totalCredits += credits;
    totalGradePoints += enrollment.gradePoints * credits;
  });

  return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
};

module.exports = mongoose.model("Marks", marksSchema);
