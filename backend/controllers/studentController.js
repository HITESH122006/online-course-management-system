const Student = require("../models/Student");
const bcrypt = require("bcryptjs");


// ===============================
// REGISTER STUDENT
// ===============================
const registerStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      phone,
      password
    } = req.body;

    if (!studentId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    const existingStudentId =
      await Student.findOne({ studentId });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID already registered"
      });
    }

    const existingEmail =
      await Student.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const student = new Student({
      studentId,
      name,
      email,
      phone,
      password: hashedPassword
    });

    await student.save();

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone
      }
    });

  } catch (error) {
    console.error(
      "Student Registration Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ===============================
// LOGIN STUDENT
// ===============================
const loginStudent = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password"
      });
    }

    const student =
      await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        student.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone
      }
    });

  } catch (error) {
    console.error(
      "Student Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ===============================
// FORGOT PASSWORD
// ===============================
const forgotPassword = async (req, res) => {
  try {
    const {
      email,
      newPassword,
      confirmPassword
    } = req.body;

    // Check all fields
    if (
      !email ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email, new password and confirm password are required"
      });
    }

    // Check passwords
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Minimum password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters"
      });
    }

    // Find student
    const student =
      await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "No student found with this email address"
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // Update password
    student.password = hashedPassword;

    await student.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password."
    });

  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ===============================
// GET ALL STUDENTS
// ===============================
const getStudents = async (req, res) => {
  try {
    const students =
      await Student.find().select("-password");

    return res.status(200).json({
      success: true,
      students
    });

  } catch (error) {
    console.error(
      "Get Students Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ===============================
// GET STUDENT BY ID
// ===============================
const getStudentById = async (req, res) => {
  try {
    const student =
      await Student.findById(
        req.params.id
      ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    return res.status(200).json({
      success: true,
      student
    });

  } catch (error) {
    console.error(
      "Get Student Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ===============================
// DELETE STUDENT
// ===============================
const deleteStudent = async (req, res) => {
  try {
    const student =
      await Student.findByIdAndDelete(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (error) {
    console.error(
      "Delete Student Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
  registerStudent,
  loginStudent,
  forgotPassword,
  getStudents,
  getStudentById,
  deleteStudent
};