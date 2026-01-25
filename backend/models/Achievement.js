const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Academic",
        "Research",
        "Sports",
        "Cultural",
        "Technical",
        "Competition",
        "Award",
        "Publication",
        "Project",
        "Hackathon",
        "Certification",
        "Innovation",
        "Other",
      ],
      default: "Other",
    },
    achievedBy: {
      type: String,
      required: [true, "Achiever name is required"],
      trim: true,
    },
    achieverType: {
      type: String,
      enum: ["Faculty", "Team", "Department"],
      default: "Faculty",
    },
    date: {
      type: Date,
      required: [true, "Achievement date is required"],
    },
    year: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    organizer: {
      type: String,
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    prize: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    certificateUrl: {
      type: String,
      trim: true,
    },
    proofUrl: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
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

// Indexes for faster queries
achievementSchema.index({ category: 1 });
achievementSchema.index({ achieverType: 1 });
achievementSchema.index({ date: -1 });
achievementSchema.index({ isFeatured: 1 });
achievementSchema.index({ isActive: 1 });

module.exports = mongoose.model("Achievement", achievementSchema);
