const dns = require("dns");

// Ensure DNS resolution works reliably for MongoDB Atlas SRV records on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.log("DNS setServers notice:", e.message);
}

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import route modules
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root health & info route
app.get("/", (req, res) => {
  res.json({
    project: "Online Course Management System",
    status: "Running",
    mongoStatus: mongoose.connection.readyState === 1 ? "Connected" : "Connecting/Disconnected",
    documentation: "/api/courses, /api/students, /api/instructors, /api/enrollments, /api/lessons, /api/analytics",
  });
});

// API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/analytics", analyticsRoutes);


// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error: " + err.message });
});

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in backend/.env file!");
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
    console.log("NOTE: If connection failed due to IP whitelist, please add 0.0.0.0/0 to MongoDB Atlas Network Access.");
  });

// Always start express server on PORT 5000 so frontend can connect
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;