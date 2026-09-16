const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// POST /api/lessons - Create a new lesson for a course
exports.createLesson = async (req, res) => {
  try {
    const { courseId, title, description, videoUrl, duration, lessonNumber } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({
        success: false,
        message: "courseId and title are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID format" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Auto-calculate lesson number if not provided
    let lessonNum = lessonNumber;
    if (!lessonNum) {
      const count = await Lesson.countDocuments({ course: courseId });
      lessonNum = count + 1;
    }

    const lesson = new Lesson({
      course: courseId,
      title: title.trim(),
      description: description || "",
      videoUrl: videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: duration || "15 mins",
      lessonNumber: lessonNum,
    });

    const saved = await lesson.save();

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson: saved,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/lessons/course/:courseId - Get all lessons for a course
exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID format" });
    }

    const lessons = await Lesson.find({ course: courseId }).sort({ lessonNumber: 1 });

    res.status(200).json({ success: true, count: lessons.length, lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/lessons/:id - Get a single lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Lesson ID format" });
    }

    const lesson = await Lesson.findById(id).populate("course", "title category");
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    res.status(200).json({ success: true, lesson });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/lessons/:id - Update a lesson
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Lesson ID format" });
    }

    const updated = await Lesson.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updated,
    });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/lessons/:id - Delete a lesson
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Lesson ID format" });
    }

    const deleted = await Lesson.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
