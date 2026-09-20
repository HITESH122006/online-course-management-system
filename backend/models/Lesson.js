const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    videoUrl: {
      type: String,
      default: ""
    },

    duration: {
      type: String,
      default: "30 Minutes"
    },

    lessonNumber: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;