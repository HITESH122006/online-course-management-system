const Lesson = require("../models/Lesson");

// =====================================
// GET ALL LESSONS
// =====================================
const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate("course")
      .sort({ lessonNumber: 1 });

    res.status(200).json({
      success: true,
      lessons
    });

  } catch (error) {
    console.error("Get Lessons Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// =====================================
// GET LESSONS BY COURSE
// =====================================
const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({
      course: courseId
    })
      .populate("course")
      .sort({ lessonNumber: 1 });

    res.status(200).json({
      success: true,
      lessons
    });

  } catch (error) {
    console.error(
      "Get Course Lessons Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// =====================================
// GET SINGLE LESSON
// =====================================
const getLessonById = async (req, res) => {
  try {
    const lesson =
      await Lesson.findById(req.params.id)
        .populate("course");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    res.status(200).json({
      success: true,
      lesson
    });

  } catch (error) {
    console.error(
      "Get Lesson Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// =====================================
// CREATE LESSON
// =====================================
const createLesson = async (req, res) => {
  try {
    const {
      course,
      title,
      description,
      videoUrl,
      duration,
      lessonNumber
    } = req.body;

    if (
      !course ||
      !title ||
      !description ||
      !lessonNumber
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course, title, description and lesson number are required"
      });
    }

    const lesson = new Lesson({
      course,
      title,
      description,
      videoUrl,
      duration,
      lessonNumber
    });

    await lesson.save();

    const result =
      await Lesson.findById(lesson._id)
        .populate("course");

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson: result
    });

  } catch (error) {
    console.error(
      "Create Lesson Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// =====================================
// DELETE LESSON
// =====================================
const deleteLesson = async (req, res) => {
  try {
    const lesson =
      await Lesson.findByIdAndDelete(
        req.params.id
      );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully"
    });

  } catch (error) {
    console.error(
      "Delete Lesson Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  getLessons,
  getLessonsByCourse,
  getLessonById,
  createLesson,
  deleteLesson
};