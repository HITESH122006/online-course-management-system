const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Student = require("../models/Student");
const mongoose = require("mongoose");

// POST /api/enrollments - Enroll student in course
exports.createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ success: false, message: "Student ID and Course ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Student ID or Course ID format" });
    }

    // Verify student and course exist
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check duplicate enrollment (compound check)
    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Duplicate Enrollment: This student is already enrolled in " + course.title,
      });
    }

    // Create enrollment
    const newEnrollment = new Enrollment({
      student: studentId,
      course: courseId,
      status: "Active",
      progress: 0,
      enrollmentDate: new Date(),
    });

    const savedEnrollment = await newEnrollment.save();

    // Increment course studentsEnrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } });

    // Add course to student enrolledCourses
    await Student.findByIdAndUpdate(studentId, { $addToSet: { enrolledCourses: courseId } });

    const populated = await Enrollment.findById(savedEnrollment._id)
      .populate("student", "name email")
      .populate("course", "title price duration category");

    res.status(201).json({
      success: true,
      message: `Successfully enrolled in ${course.title}!`,
      enrollment: populated,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    // MongoDB duplicate key error code E11000
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate enrollment detected by database unique constraint",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/enrollments - List all enrollments
exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email phone")
      .populate("course", "title category price duration level")
      .sort({ enrollmentDate: -1 });

    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/enrollments/student/:studentId - Get student's enrollments
exports.getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid Student ID format" });
    }

    const enrollments = await Enrollment.find({ student: studentId })
      .populate("course", "title description category price duration level image rating studentsEnrolled")
      .sort({ enrollmentDate: -1 });

    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    console.error("Error fetching student enrollments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/enrollments/:id - Cancel/remove enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Enrollment ID format" });
    }

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    // Decrement course studentsEnrolled count
    await Course.findByIdAndUpdate(enrollment.course, { $inc: { studentsEnrolled: -1 } });

    // Remove from student enrolledCourses
    await Student.findByIdAndUpdate(enrollment.student, { $pull: { enrolledCourses: enrollment.course } });

    await Enrollment.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Enrollment cancelled successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/enrollments/:id - Update enrollment status or progress
exports.updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Enrollment ID format" });
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = Number(progress);

    const updated = await Enrollment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("student", "name email")
      .populate("course", "title category price");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      enrollment: updated,
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

