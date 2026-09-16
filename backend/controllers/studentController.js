const Student = require("../models/Student");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "mini-project-secret-key-2026";

// POST /api/students/register - Register new student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    // Check duplicate student email
    const existing = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: "A student with this email already exists" });
    }

    const newStudent = new Student({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || "",
      enrolledCourses: [],
    });

    const savedStudent = await newStudent.save();

    const token = jwt.sign({ id: savedStudent._id, email: savedStudent.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: {
        _id: savedStudent._id,
        name: savedStudent.name,
        email: savedStudent.email,
        phone: savedStudent.phone,
        enrolledCourses: savedStudent.enrolledCourses,
        role: savedStudent.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/students/login - Authenticate student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const student = await Student.findOne({ email: email.toLowerCase().trim() }).populate("enrolledCourses");
    if (!student) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: student._id, email: student.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        enrolledCourses: student.enrolledCourses,
        role: student.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed: " + error.message });
  }
};

// GET /api/students - List all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .populate("enrolledCourses", "title category price duration")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/:id - Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Student ID format" });
    }

    const student = await Student.findById(id)
      .select("-password")
      .populate("enrolledCourses");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
