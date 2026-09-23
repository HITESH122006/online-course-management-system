const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    enrollmentDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active"
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Enrollment = mongoose.model(
  "Enrollment",
  enrollmentSchema
);

module.exports = Enrollment;