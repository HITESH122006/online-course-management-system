const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");

// Instructor routes
router.get("/", instructorController.getInstructors);
router.get("/:id", instructorController.getInstructorById);
router.post("/", instructorController.createInstructor);

module.exports = router;
