const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");

// Enrollment routes
router.post("/", enrollmentController.createEnrollment);
router.get("/", enrollmentController.getEnrollments);
router.get("/student/:studentId", enrollmentController.getStudentEnrollments);
router.patch("/:id", enrollmentController.updateEnrollment);
router.delete("/:id", enrollmentController.deleteEnrollment);

module.exports = router;

