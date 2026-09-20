const dns = require("dns");

// ======================================================
// DNS CONFIGURATION
// Helps MongoDB Atlas SRV DNS resolution on Windows
// ======================================================
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
  console.log("DNS configuration notice:", error.message);
}


// ======================================================
// IMPORT PACKAGES
// ======================================================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


// ======================================================
// IMPORT ROUTES
// ======================================================
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");


// ======================================================
// CREATE EXPRESS APP
// ======================================================
const app = express();

const PORT = process.env.PORT || 5000;


// ======================================================
// MIDDLEWARE
// ======================================================
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());


// ======================================================
// ROOT / HEALTH CHECK
// ======================================================
app.get("/", (req, res) => {
  res.status(200).json({
    project: "Online Course Management System",
    status: "Running",
    mongoStatus:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Connecting/Disconnected",
    documentation:
      "/api/courses, /api/students, /api/instructors, /api/enrollments, /api/lessons, /api/analytics"
  });
});


// ======================================================
// API ROUTES
// ======================================================

// Courses
app.use("/api/courses", courseRoutes);

// Students
app.use("/api/students", studentRoutes);

// Instructors
app.use("/api/instructors", instructorRoutes);

// Enrollments
app.use("/api/enrollments", enrollmentRoutes);

// Lessons
app.use("/api/lessons", lessonRoutes);

// Analytics
app.use("/api/analytics", analyticsRoutes);


// ======================================================
// 404 ROUTE
// ======================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:");
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});


// ======================================================
// MONGODB CONNECTION
// ======================================================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(
    "ERROR: MONGO_URI is not defined in backend/.env file."
  );
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("=================================");
      console.log("MongoDB Connected Successfully");
      console.log("=================================");
    })
    .catch((error) => {
      console.error("=================================");
      console.error("MongoDB Connection Error");
      console.error("=================================");
      console.error(error.message);
      console.error(
        "If using MongoDB Atlas, check your Network Access/IP whitelist."
      );
    });
}


// ======================================================
// MONGODB CONNECTION EVENTS
// ======================================================
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});


// ======================================================
// START SERVER
// ======================================================
app.listen(PORT, () => {
  console.log("=================================");
  console.log(
    `Server running on http://localhost:${PORT}`
  );
  console.log("=================================");
});


// ======================================================
// EXPORT APP
// ======================================================
module.exports = app;