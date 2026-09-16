const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Course = require("./models/Course");
const Instructor = require("./models/Instructor");
const Student = require("./models/Student");
const Enrollment = require("./models/Enrollment");
const Lesson = require("./models/Lesson");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully for Seeding");

    // Clean existing data for clean reproducible state
    console.log("Clearing existing collections...");
    await Promise.all([
      Course.deleteMany({}),
      Instructor.deleteMany({}),
      Student.deleteMany({}),
      Enrollment.deleteMany({}),
      Lesson.deleteMany({}),
    ]);
    console.log("Collections cleared successfully.");

    // 1. Insert 3 Instructors
    console.log("Inserting Instructors...");
    const instructors = await Instructor.insertMany([
      {
        name: "Dr. Angela Yu",
        email: "angela.yu@example.com",
        specialization: "Full Stack Web Development & Mobile Apps",
        experience: 10,
        bio: "Senior developer and instructor teaching over 1 million developers worldwide.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      },
      {
        name: "Prof. Andrew Ng",
        email: "andrew.ng@example.com",
        specialization: "Artificial Intelligence & Machine Learning",
        experience: 16,
        bio: "AI pioneer, adjunct professor at Stanford University, and deep learning researcher.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      },
      {
        name: "Maximilian Schwarzmüller",
        email: "max.schwarz@example.com",
        specialization: "Database Systems & Cloud Computing",
        experience: 12,
        bio: "Cloud solutions architect and database consultant specialized in modern architectures.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      },
    ]);
    console.log(`Inserted ${instructors.length} Instructors.`);

    // 2. Insert 8 Courses
    console.log("Inserting Courses...");
    const courses = await Course.insertMany([
      {
        title: "The Complete 2026 Web Development Bootcamp",
        description: "Master HTML, CSS, JavaScript, React 19, Next.js, Node.js and MongoDB by building 16 real-world projects.",
        instructor: instructors[0]._id,
        instructorName: instructors[0].name,
        category: "Web Development",
        duration: "55 Hours",
        price: 999,
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60",
        rating: 4.8,
        studentsEnrolled: 0,
      },
      {
        title: "MongoDB Masterclass: Aggregation Pipelines & Atlas",
        description: "Comprehensive guide to MongoDB schema design, indexing, replication, aggregation framework, and Mongoose ODM.",
        instructor: instructors[2]._id,
        instructorName: instructors[2].name,
        category: "Database",
        duration: "28 Hours",
        price: 799,
        level: "Intermediate",
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=60",
        rating: 4.9,
        studentsEnrolled: 0,
      },
      {
        title: "Deep Learning & Neural Networks Specialization",
        description: "Master PyTorch, TensorFlow, CNNs, Transformers, and GenAI models from the mathematical foundations.",
        instructor: instructors[1]._id,
        instructorName: instructors[1].name,
        category: "Artificial Intelligence",
        duration: "64 Hours",
        price: 1499,
        level: "Advanced",
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60",
        rating: 4.9,
        studentsEnrolled: 0,
      },
      {
        title: "Python for Data Science and Machine Learning Bootcamp",
        description: "Learn NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, and real-world predictive analysis algorithms.",
        instructor: instructors[1]._id,
        instructorName: instructors[1].name,
        category: "Data Science",
        duration: "40 Hours",
        price: 899,
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
        rating: 4.7,
        studentsEnrolled: 0,
      },
      {
        title: "AWS Certified Solutions Architect & Cloud Mastery",
        description: "Design fault-tolerant, highly available distributed architectures on Amazon Web Services cloud infrastructure.",
        instructor: instructors[2]._id,
        instructorName: instructors[2].name,
        category: "Cloud Computing",
        duration: "35 Hours",
        price: 1199,
        level: "Intermediate",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60",
        rating: 4.8,
        studentsEnrolled: 0,
      },
      {
        title: "Complete Core & Advanced Java with Spring Boot",
        description: "OOP concepts, Collections, Multithreading, Streams API, Spring Boot microservices, and Hibernate ORM.",
        instructor: instructors[0]._id,
        instructorName: instructors[0].name,
        category: "Programming",
        duration: "48 Hours",
        price: 849,
        level: "Intermediate",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60",
        rating: 4.6,
        studentsEnrolled: 0,
      },
      {
        title: "Relational Database Design & Advanced SQL",
        description: "Entity-Relationship modeling, 1NF-BCNF Normalization, complex JOINs, CTEs, Indexing, and ACID transactions.",
        instructor: instructors[2]._id,
        instructorName: instructors[2].name,
        category: "Database",
        duration: "24 Hours",
        price: 699,
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop&q=60",
        rating: 4.7,
        studentsEnrolled: 0,
      },
      {
        title: "Modern React 19 & Next.js Full Stack Architecture",
        description: "Server Actions, Server Components, Route Handlers, TypeScript, and modern state management patterns.",
        instructor: instructors[0]._id,
        instructorName: instructors[0].name,
        category: "Web Development",
        duration: "32 Hours",
        price: 949,
        level: "Intermediate",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60",
        rating: 4.8,
        studentsEnrolled: 0,
      },
    ]);
    console.log(`Inserted ${courses.length} Courses.`);

    // 3. Insert 6 Students (passwords hashed with bcrypt)
    console.log("Inserting Students...");
    const hashedPassword = await bcrypt.hash("student123", 10);
    const students = await Student.insertMany([
      {
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        password: hashedPassword,
        phone: "+91 9876543210",
        role: "student",
        enrolledCourses: [],
      },
      {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        password: hashedPassword,
        phone: "+91 9876543211",
        role: "student",
        enrolledCourses: [],
      },
      {
        name: "Aarav Deshmukh",
        email: "aarav.d@example.com",
        password: hashedPassword,
        phone: "+91 9876543212",
        role: "student",
        enrolledCourses: [],
      },
      {
        name: "Sneha Kulkarni",
        email: "sneha.k@example.com",
        password: hashedPassword,
        phone: "+91 9876543213",
        role: "student",
        enrolledCourses: [],
      },
      {
        name: "Vikram Jadhav",
        email: "vikram.j@example.com",
        password: hashedPassword,
        phone: "+91 9876543214",
        role: "student",
        enrolledCourses: [],
      },
      {
        name: "Ananya Joshi",
        email: "ananya.j@example.com",
        password: hashedPassword,
        phone: "+91 9876543215",
        role: "student",
        enrolledCourses: [],
      },
    ]);
    console.log(`Inserted ${students.length} Students.`);

    // 4. Insert 10 Enrollments
    console.log("Inserting Enrollments...");
    const enrollmentData = [
      { student: students[0]._id, course: courses[0]._id, progress: 65, status: "Active" },
      { student: students[0]._id, course: courses[1]._id, progress: 90, status: "Active" },
      { student: students[1]._id, course: courses[0]._id, progress: 100, status: "Completed" },
      { student: students[1]._id, course: courses[2]._id, progress: 40, status: "Active" },
      { student: students[2]._id, course: courses[1]._id, progress: 50, status: "Active" },
      { student: students[2]._id, course: courses[3]._id, progress: 75, status: "Active" },
      { student: students[3]._id, course: courses[4]._id, progress: 30, status: "Active" },
      { student: students[4]._id, course: courses[5]._id, progress: 85, status: "Active" },
      { student: students[4]._id, course: courses[6]._id, progress: 100, status: "Completed" },
      { student: students[5]._id, course: courses[7]._id, progress: 45, status: "Active" },
    ];

    const enrollments = await Enrollment.insertMany(enrollmentData);
    console.log(`Inserted ${enrollments.length} Enrollments.`);

    // Synchronize enrolled courses to student documents and count to courses
    for (const enr of enrollments) {
      await Student.findByIdAndUpdate(enr.student, { $addToSet: { enrolledCourses: enr.course } });
      await Course.findByIdAndUpdate(enr.course, { $inc: { studentsEnrolled: 1 } });
    }
    console.log("Synchronized student enrolled courses and course student counters.");

    // 5. Insert 12 Lessons
    console.log("Inserting Lessons...");
    const lessonsData = [
      // Lessons for Web Dev Bootcamp
      { title: "Introduction to HTML5 & Semantic Elements", course: courses[0]._id, duration: "25 mins", lessonNumber: 1 },
      { title: "CSS3 Flexbox, Grid and Responsive Design", course: courses[0]._id, duration: "45 mins", lessonNumber: 2 },
      { title: "JavaScript ES6+ Syntax, Promises & Async/Await", course: courses[0]._id, duration: "50 mins", lessonNumber: 3 },
      { title: "Building Full-Stack Next.js 16 Applications", course: courses[0]._id, duration: "60 mins", lessonNumber: 4 },

      // Lessons for MongoDB Masterclass
      { title: "MongoDB Atlas Cluster Setup & Database Connection", course: courses[1]._id, duration: "30 mins", lessonNumber: 1 },
      { title: "CRUD Operations: insertOne, find, updateOne, deleteOne", course: courses[1]._id, duration: "45 mins", lessonNumber: 2 },
      { title: "Advanced Aggregation Framework ($group, $match, $sort)", course: courses[1]._id, duration: "55 mins", lessonNumber: 3 },
      { title: "Data Modeling, Indexing & Compound Unique Constraints", course: courses[1]._id, duration: "40 mins", lessonNumber: 4 },

      // Lessons for AI Specialization
      { title: "Foundations of Deep Learning & Perceptrons", course: courses[2]._id, duration: "40 mins", lessonNumber: 1 },
      { title: "Convolutional Neural Networks for Computer Vision", course: courses[2]._id, duration: "55 mins", lessonNumber: 2 },

      // Lessons for Data Science Bootcamp
      { title: "Exploratory Data Analysis with Pandas and NumPy", course: courses[3]._id, duration: "50 mins", lessonNumber: 1 },
      { title: "Supervised Machine Learning with Scikit-Learn", course: courses[3]._id, duration: "60 mins", lessonNumber: 2 },
    ];

    const lessons = await Lesson.insertMany(lessonsData);
    console.log(`Inserted ${lessons.length} Lessons.`);

    console.log("\n=======================================================");
    console.log("DATABASE SEEDED SUCCESSFULLY!");
    console.log(`- Instructors: ${instructors.length}`);
    console.log(`- Courses:     ${courses.length}`);
    console.log(`- Students:    ${students.length} (Password for all: student123)`);
    console.log(`- Enrollments: ${enrollments.length}`);
    console.log(`- Lessons:     ${lessons.length}`);
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
};

seedDatabase();
