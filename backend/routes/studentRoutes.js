const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Student routes
router.post("/register", studentController.registerStudent);
router.post("/login", studentController.loginStudent);
router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudentById);

module.exports = router;
