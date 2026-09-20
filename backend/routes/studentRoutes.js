const express = require("express");

const {
  registerStudent,
  loginStudent,
  getStudents,
  getStudentById,
  deleteStudent
} = require("../controllers/studentController");

const router = express.Router();

// Register student
router.post("/register", registerStudent);

// Login student
router.post("/login", loginStudent);

// Get all students
router.get("/", getStudents);

// Get student by ID
router.get("/:id", getStudentById);

// Delete student
router.delete("/:id", deleteStudent);

module.exports = router;