const express = require("express");

const {
  enrollStudent,
  getStudentEnrollments,
  getAllEnrollments,
  updateProgress,
  markLessonCompleted
} = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/", enrollStudent);

router.get("/student/:studentId", getStudentEnrollments);

router.get("/", getAllEnrollments);

router.put("/:enrollmentId/progress", updateProgress);

router.put(
  "/:enrollmentId/lesson/:lessonId/complete",
  markLessonCompleted
);

module.exports = router;