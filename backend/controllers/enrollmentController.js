const Enrollment = require("../models/Enrollment");

// ===============================
// ENROLL STUDENT IN COURSE
// ===============================
const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Course ID are required"
      });
    }

    // Check if already enrolled
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

    // Create enrollment
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId
    });

    await enrollment.save();

    // Return enrollment with student and course details
    const result = await Enrollment.findById(
      enrollment._id
    )
      .populate("student", "-password")
      .populate("course");

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


// ===============================
// GET STUDENT ENROLLMENTS
// ===============================
const getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;

    const enrollments = await Enrollment.find({
      student: studentId
    })
      .populate("student", "-password")
      .populate("course")
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


// ===============================
// GET ALL ENROLLMENTS
// ===============================
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "-password")
      .populate("course")
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


// ===============================
// UPDATE COURSE PROGRESS
// ===============================
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
      {
        new: true
      }
    )
      .populate("student", "-password")
      .populate("course");

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


module.exports = {
  enrollStudent,
  getStudentEnrollments,
  getAllEnrollments,
  updateProgress
};