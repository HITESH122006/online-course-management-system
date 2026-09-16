const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");
const mongoose = require("mongoose");

// GET /api/courses - List courses with search, filter, and sorting
exports.getCourses = async (req, res) => {
  try {
    const { search, category, level, sort, minPrice, maxPrice } = req.query;

    const filter = {};

    // Search by title or description (regex, case-insensitive)
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filter by category
    if (category && category !== "All") {
      filter.category = category;
    }

    // Filter by difficulty level
    if (level && level !== "All") {
      filter.level = level;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== "") filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") filter.price.$lte = Number(maxPrice);
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // default newest first
    if (sort === "price_asc" || sort === "price") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    } else if (sort === "popular") {
      sortOption = { studentsEnrolled: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email specialization avatar")
      .sort(sortOption);

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Failed to fetch courses: " + error.message });
  }
};

// GET /api/courses/:id - Get single course details with lessons
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID format" });
    }

    const course = await Course.findById(id).populate("instructor", "name email specialization bio avatar");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Also fetch syllabus lessons
    const lessons = await Lesson.find({ course: id }).sort({ lessonNumber: 1 });

    res.status(200).json({
      success: true,
      course,
      lessons,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch course: " + error.message });
  }
};

// POST /api/courses - Create new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, duration, price, level, image, instructor, instructorName } = req.body;

    // Backend validation
    if (!title || !description || !category || !duration || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: title, description, category, duration, price",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ success: false, message: "Price must be a positive number or zero" });
    }

    const courseData = {
      title: title.trim(),
      description: description.trim(),
      category,
      duration: duration.trim(),
      price: Number(price),
      level: level || "Beginner",
      image: image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60",
      instructorName: instructorName || "Senior Instructor",
    };

    if (instructor && mongoose.Types.ObjectId.isValid(instructor)) {
      courseData.instructor = instructor;
    }

    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully in MongoDB Atlas",
      course: savedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/courses/:id - Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID format" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("instructor", "name email");

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found to update" });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully in MongoDB Atlas",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/courses/:id - Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID format" });
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: "Course not found to delete" });
    }

    // Cascade delete associated enrollments and lessons
    await Enrollment.deleteMany({ course: id });
    await Lesson.deleteMany({ course: id });

    res.status(200).json({
      success: true,
      message: "Course and related records deleted successfully from MongoDB Atlas",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Failed to delete course: " + error.message });
  }
};
