const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: false,
    },
    instructorName: {
      type: String,
      default: "Senior Instructor",
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
      enum: [
        "Programming",
        "Web Development",
        "Database",
        "Data Science",
        "Artificial Intelligence",
        "Cloud Computing",
        "Other",
      ],
      default: "Web Development",
    },
    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
      min: [0, "Enrollment count cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to get instructor display name
courseSchema.virtual("displayInstructor").get(function () {
  if (this.instructor && typeof this.instructor === "object" && this.instructor.name) {
    return this.instructor.name;
  }
  return this.instructorName || "Senior Instructor";
});

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Course", courseSchema);