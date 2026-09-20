const dns = require("dns");

// Use Google DNS before MongoDB connection
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
require("dotenv").config();

const Course = require("./models/Course");
const Lesson = require("./models/Lesson");

const MONGO_URI = process.env.MONGO_URI;

const seedLessons = async () => {
  try {
    if (!MONGO_URI) {
      console.log("MONGO_URI is missing from .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    const courses = await Course.find();

    if (courses.length === 0) {
      console.log("No courses found.");
      await mongoose.connection.close();
      process.exit(1);
    }

    // Remove old lessons
    await Lesson.deleteMany({});

    for (const course of courses) {
      const lessons = [
        {
          course: course._id,
          title: "Introduction",
          description: `Introduction to ${course.title}.`,
          duration: "20 Minutes",
          lessonNumber: 1
        },
        {
          course: course._id,
          title: "Basic Concepts",
          description: `Learn the basic concepts of ${course.title}.`,
          duration: "30 Minutes",
          lessonNumber: 2
        },
        {
          course: course._id,
          title: "Practical Examples",
          description: `Practice important concepts of ${course.title}.`,
          duration: "40 Minutes",
          lessonNumber: 3
        },
        {
          course: course._id,
          title: "Advanced Concepts",
          description: `Learn advanced concepts of ${course.title}.`,
          duration: "45 Minutes",
          lessonNumber: 4
        },
        {
          course: course._id,
          title: "Final Practice",
          description: `Complete practical exercises for ${course.title}.`,
          duration: "50 Minutes",
          lessonNumber: 5
        }
      ];

      await Lesson.insertMany(lessons);

      console.log(`Lessons added for: ${course.title}`);
    }

    console.log("--------------------------------");
    console.log("Lesson seeding completed successfully!");
    console.log("--------------------------------");

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("Lesson Seed Error:", error);
    process.exit(1);
  }
};

seedLessons();