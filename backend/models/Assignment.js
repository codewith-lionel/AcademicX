const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  files: [
    {
      filename: String,
      url: String,
      fileType: String,
      fileSize: Number,
    },
  ],
  textContent: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["submitted", "late", "graded", "returned"],
    default: "submitted",
  },
  marks: {
    type: Number,
    default: null,
  },
  feedback: {
    type: String,
    default: "",
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  gradedAt: {
    type: Date,
  },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
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
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    allowLateSubmission: {
      type: Boolean,
      default: false,
    },
    lateSubmissionDeadline: {
      type: Date,
    },
    attachments: [
      {
        filename: String,
        url: String,
        fileType: String,
      },
    ],
    instructions: {
      type: String,
      default: "",
    },
    submissions: [submissionSchema],
    createdBy: {
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

// Index for efficient queries
assignmentSchema.index({ course: 1, semester: 1, dueDate: -1 });

// Method to check if submission is late
assignmentSchema.methods.isSubmissionLate = function (submissionDate) {
  return submissionDate > this.dueDate;
};

// Method to get student submission
assignmentSchema.methods.getStudentSubmission = function (studentId) {
  return this.submissions.find(
    (sub) => sub.student.toString() === studentId.toString()
  );
};

module.exports = mongoose.model("Assignment", assignmentSchema);
