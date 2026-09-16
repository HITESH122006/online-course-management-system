const Instructor = require("../models/Instructor");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// GET /api/instructors - List all instructors
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find().sort({ experience: -1 });
    res.status(200).json({ success: true, count: instructors.length, instructors });
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/instructors/:id - Get instructor and their courses
exports.getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Instructor ID format" });
    }

    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: "Instructor not found" });
    }

    const courses = await Course.find({ instructor: id });

    res.status(200).json({ success: true, instructor, courses });
  } catch (error) {
    console.error("Error fetching instructor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/instructors - Create instructor
exports.createInstructor = async (req, res) => {
  try {
    const { name, email, specialization, experience, bio, avatar } = req.body;

    if (!name || !email || !specialization || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, email, specialization, and experience are required",
      });
    }

    const existing = await Instructor.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Instructor with this email already exists" });
    }

    const instructor = new Instructor({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      specialization: specialization.trim(),
      experience: Number(experience),
      bio: bio || "Experienced industry educator and software architect.",
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    });

    const saved = await instructor.save();
    res.status(201).json({ success: true, message: "Instructor created successfully", instructor: saved });
  } catch (error) {
    console.error("Error creating instructor:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
