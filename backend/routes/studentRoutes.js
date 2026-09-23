const express = require("express");

const {
  registerStudent,
  loginStudent,
  forgotPassword,
  getStudents,
  getStudentById,
  deleteStudent
} = require("../controllers/studentController");

const router = express.Router();


// ===============================
// REGISTER
// ===============================
router.post(
  "/register",
  registerStudent
);


// ===============================
// LOGIN
// ===============================
router.post(
  "/login",
  loginStudent
);


// ===============================
// FORGOT / RESET PASSWORD
// ===============================
router.post(
  "/forgot-password",
  forgotPassword
);


// ===============================
// GET ALL STUDENTS
// ===============================
router.get(
  "/",
  getStudents
);


// ===============================
// GET STUDENT BY ID
// ===============================
router.get(
  "/:id",
  getStudentById
);


// ===============================
// DELETE STUDENT
// ===============================
router.delete(
  "/:id",
  deleteStudent
);


module.exports = router;