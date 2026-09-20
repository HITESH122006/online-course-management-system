const express = require("express");

const {
  enrollStudent,
  getStudentEnrollments,
  getAllEnrollments,
  updateProgress
} = require("../controllers/enrollmentController");

const router = express.Router();

// Enroll student in a course
router.post("/", enrollStudent);

// Get student's enrollments
router.get("/student/:studentId", getStudentEnrollments);

// Get all enrollments
router.get("/", getAllEnrollments);

// Update course progress
router.put("/:enrollmentId/progress", updateProgress);

module.exports = router;