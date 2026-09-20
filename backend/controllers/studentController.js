const Student = require("../models/Student");
const bcrypt = require("bcryptjs");


// ===============================
// REGISTER STUDENT
// ===============================
const registerStudent = async (req, res) => {
  try {
    const { studentId, name, email, phone, password } = req.body;

    if (!studentId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    const existingStudentId = await Student.findOne({ studentId });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID already registered"
      });
    }

    const existingEmail = await Student.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    console.error("Student Registration Error:", error);

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
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password"
      });
    }

    // Find student using email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Successful login
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
    console.error("Student Login Error:", error);

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
    const students = await Student.find().select("-password");

    return res.status(200).json({
      success: true,
      students
    });

  } catch (error) {
    console.error("Get Students Error:", error);

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
    const student = await Student.findById(req.params.id).select("-password");

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
    console.error("Get Student Error:", error);

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
    const student = await Student.findByIdAndDelete(req.params.id);

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
    console.error("Delete Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  registerStudent,
  loginStudent,
  getStudents,
  getStudentById,
  deleteStudent
};