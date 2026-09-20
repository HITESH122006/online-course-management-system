const mongoose = require("mongoose");
require("dotenv").config();

const Instructor = require("./models/Instructor");
const Course = require("./models/Course");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/online_course_management";

const instructors = [
  {
    name: "Dr. Amit Sharma",
    email: "amit.sharma@example.com",
    phone: "9876543210",
    specialization: "Web Development"
  },
  {
    name: "Priya Deshmukh",
    email: "priya.deshmukh@example.com",
    phone: "9876543211",
    specialization: "Database Management"
  },
  {
    name: "Rahul Patil",
    email: "rahul.patil@example.com",
    phone: "9876543212",
    specialization: "Python Programming"
  },
  {
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@example.com",
    phone: "9876543213",
    specialization: "Data Science"
  }
];

const courses = [
  {
    title: "Web Development",
    description:
      "Learn HTML, CSS, JavaScript and modern web development concepts.",
    category: "Web Development",
    duration: "8 Weeks"
  },
  {
    title: "Database Management",
    description:
      "Learn SQL, MongoDB, database design and database management concepts.",
    category: "Database",
    duration: "6 Weeks"
  },
  {
    title: "Python Programming",
    description:
      "Learn Python programming from basic concepts to advanced programming.",
    category: "Programming",
    duration: "8 Weeks"
  },
  {
    title: "Data Science",
    description:
      "Learn data analysis, visualization and basic machine learning concepts.",
    category: "Data Science",
    duration: "10 Weeks"
  },
  {
    title: "Java Programming",
    description:
      "Learn Java programming, object-oriented programming and application development.",
    category: "Programming",
    duration: "8 Weeks"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Remove old sample instructors and courses
    await Instructor.deleteMany({});
    await Course.deleteMany({});

    // Insert instructors
    const createdInstructors = await Instructor.insertMany(instructors);

    console.log("Instructors inserted successfully");

    // Assign instructors to courses
    const courseData = courses.map((course, index) => ({
      ...course,
      instructor: createdInstructors[index % createdInstructors.length]._id
    }));

    await Course.insertMany(courseData);

    console.log("Courses inserted successfully");

    console.log("\nIndian Instructors:");

    createdInstructors.forEach((instructor) => {
      console.log(`- ${instructor.name}`);
    });

    console.log("\nCourses:");

    courseData.forEach((course) => {
      console.log(`- ${course.title}`);
    });

    console.log("\nDatabase seeding completed successfully!");

    await mongoose.connection.close();

  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();