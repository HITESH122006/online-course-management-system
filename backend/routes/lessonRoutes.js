const express = require("express");

const {
  getLessons,
  getLessonsByCourse,
  getLessonById,
  createLesson,
  deleteLesson
} = require("../controllers/lessonController");

const router = express.Router();

// Get all lessons
router.get("/", getLessons);

// Get lessons for one course
router.get("/course/:courseId", getLessonsByCourse);

// Get one lesson
router.get("/:id", getLessonById);

// Create lesson
router.post("/", createLesson);

// Delete lesson
router.delete("/:id", deleteLesson);

module.exports = router;