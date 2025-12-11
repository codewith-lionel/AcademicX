const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent", "late", "excused"],
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
});

const attendanceSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    sessionType: {
      type: String,
      enum: ["lecture", "lab", "tutorial", "seminar"],
      default: "lecture",
    },
    duration: {
      type: Number, // in hours
      default: 1,
    },
    records: [attendanceRecordSchema],
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    academicYear: {
      type: String,
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

// Compound index to prevent duplicate attendance for same course, date, session
attendanceSchema.index(
  { course: 1, date: 1, sessionType: 1 },
  { unique: true }
);

// Method to get attendance percentage for a student
attendanceSchema.statics.getStudentAttendancePercentage = async function (
  studentId,
  courseId,
  semester
) {
  const attendances = await this.find({
    course: courseId,
    semester: semester,
    "records.student": studentId,
  });

  let totalClasses = attendances.length;
  let presentCount = 0;

  attendances.forEach((attendance) => {
    const record = attendance.records.find(
      (r) => r.student.toString() === studentId.toString()
    );
    if (record && (record.status === "present" || record.status === "late")) {
      presentCount++;
    }
  });

  return totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
};

module.exports = mongoose.model("Attendance", attendanceSchema);
