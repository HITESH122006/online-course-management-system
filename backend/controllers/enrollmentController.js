const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");

// ENROLL STUDENT IN COURSE
const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Course ID are required"
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course"
      });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLessons: [],
      status: "Active"
    });

    await enrollment.save();

    const result = await Enrollment.findById(enrollment._id)
      .populate("student", "-password")
      .populate("course")
      .populate("completedLessons");

    return res.status(201).json({
      success: true,
      message: "Course enrollment successful",
      enrollment: result
    });
  } catch (error) {
    console.error("Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// GET STUDENT ENROLLMENTS
const getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;

    const enrollments = await Enrollment.find({
      student: studentId
    })
      .populate("student", "-password")
      .populate("course")
      .populate("completedLessons")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      enrollments
    });
  } catch (error) {
    console.error("Get Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// GET ALL ENROLLMENTS
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "-password")
      .populate("course")
      .populate("completedLessons")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      enrollments
    });
  } catch (error) {
    console.error("Get All Enrollments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// UPDATE COURSE PROGRESS
const updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;

    if (
      progress === undefined ||
      progress < 0 ||
      progress > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100"
      });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      {
        progress,
        status: progress === 100 ? "Completed" : "Active"
      },
      { new: true }
    )
      .populate("student", "-password")
      .populate("course")
      .populate("completedLessons");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      enrollment
    });
  } catch (error) {
    console.error("Update Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// MARK LESSON AS COMPLETED
const markLessonCompleted = async (req, res) => {
  try {
    const { enrollmentId, lessonId } = req.params;

    console.log("Enrollment ID:", enrollmentId);
    console.log("Lesson ID:", lessonId);

    // Find enrollment
    const enrollment = await Enrollment.findById(
      enrollmentId
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    // Find lesson
    const lesson = await Lesson.findById(
      lessonId
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    // Make sure completedLessons exists
    if (!Array.isArray(enrollment.completedLessons)) {
      enrollment.completedLessons = [];
    }

    // Check that lesson belongs to enrolled course
    if (
      lesson.course.toString() !==
      enrollment.course.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This lesson does not belong to the enrolled course"
      });
    }

    // Check whether lesson is already completed
    const alreadyCompleted =
      enrollment.completedLessons.some(
        (id) =>
          id.toString() === lessonId.toString()
      );

    // Add lesson only if it is not already completed
    if (!alreadyCompleted) {
      enrollment.completedLessons.push(
        lessonId
      );
    }

    // Count total lessons in this course
    const totalLessons =
      await Lesson.countDocuments({
        course: enrollment.course
      });

    // Calculate progress
    let progress = 0;

    if (totalLessons > 0) {
      progress = Math.round(
        (enrollment.completedLessons.length /
          totalLessons) *
          100
      );
    }

    // Never allow progress above 100
    progress = Math.min(progress, 100);

    enrollment.progress = progress;

    // Update enrollment status
    if (progress === 100) {
      enrollment.status = "Completed";
    } else {
      enrollment.status = "Active";
    }

    // Save enrollment
    await enrollment.save();

    // Get updated enrollment
    const result =
      await Enrollment.findById(
        enrollment._id
      )
        .populate("student", "-password")
        .populate("course")
        .populate("completedLessons");

    return res.status(200).json({
      success: true,

      message: alreadyCompleted
        ? "Lesson is already completed"
        : "Lesson marked as completed",

      progress: result.progress,

      completedLessons:
        result.completedLessons,

      enrollment: result
    });

  } catch (error) {
    console.error(
      "Mark Lesson Completed Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  enrollStudent,
  getStudentEnrollments,
  getAllEnrollments,
  updateProgress,
  markLessonCompleted
};