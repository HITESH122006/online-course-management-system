const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");

// 1. GET /api/analytics/courses-by-category
// Aggregation Stage: $group, $sort
exports.getCoursesByCategory = async (req, res) => {
  try {
    const data = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          totalCourses: { $sum: 1 },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { totalCourses: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      description: "Count courses grouped by category using MongoDB $group & $sort",
      pipeline: [
        { $group: { _id: "$category", totalCourses: { $sum: 1 }, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } } },
        { $sort: { totalCourses: -1 } },
      ],
      data,
    });
  } catch (error) {
    console.error("Aggregation error (courses-by-category):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /api/analytics/average-price
// Aggregation Stage: $group, $project, $sort
exports.getAveragePriceByCategory = async (req, res) => {
  try {
    const data = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          averagePrice: { $avg: "$price" },
          totalCourses: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          totalCourses: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          _id: 0,
        },
      },
      {
        $sort: { averagePrice: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      description: "Calculate average course price by category using $group, $avg, $round, and $sort",
      pipeline: [
        { $group: { _id: "$category", averagePrice: { $avg: "$price" }, totalCourses: { $sum: 1 } } },
        { $project: { category: "$_id", totalCourses: 1, averagePrice: { $round: ["$averagePrice", 2] }, _id: 0 } },
        { $sort: { averagePrice: -1 } },
      ],
      data,
    });
  } catch (error) {
    console.error("Aggregation error (average-price):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET /api/analytics/course-enrollments
// Aggregation Stage: $project, $sort, $limit
exports.getCourseEnrollments = async (req, res) => {
  try {
    const data = await Course.aggregate([
      {
        $project: {
          title: 1,
          category: 1,
          price: 1,
          rating: 1,
          studentsEnrolled: 1,
          estimatedRevenue: { $multiply: ["$price", "$studentsEnrolled"] },
        },
      },
      {
        $sort: { studentsEnrolled: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      description: "Rank popular courses by student enrollment using $project, $multiply, $sort, and $limit",
      pipeline: [
        { $project: { title: 1, category: 1, price: 1, rating: 1, studentsEnrolled: 1, estimatedRevenue: { $multiply: ["$price", "$studentsEnrolled"] } } },
        { $sort: { studentsEnrolled: -1 } },
        { $limit: 10 },
      ],
      data,
    });
  } catch (error) {
    console.error("Aggregation error (course-enrollments):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. GET /api/analytics/instructor-summary
// Aggregation Stage: $group, $project, $sort
exports.getInstructorSummary = async (req, res) => {
  try {
    const data = await Course.aggregate([
      {
        $group: {
          _id: "$instructorName",
          totalCourses: { $sum: 1 },
          totalStudents: { $sum: "$studentsEnrolled" },
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $project: {
          instructor: "$_id",
          totalCourses: 1,
          totalStudents: 1,
          averageRating: { $round: ["$averageRating", 2] },
          _id: 0,
        },
      },
      {
        $sort: { totalStudents: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      description: "Group courses by instructor to compute course count, student reach, and avg rating",
      pipeline: [
        { $group: { _id: "$instructorName", totalCourses: { $sum: 1 }, totalStudents: { $sum: "$studentsEnrolled" }, averageRating: { $avg: "$rating" } } },
        { $project: { instructor: "$_id", totalCourses: 1, totalStudents: 1, averageRating: { $round: ["$averageRating", 2] }, _id: 0 } },
        { $sort: { totalStudents: -1 } },
      ],
      data,
    });
  } catch (error) {
    console.error("Aggregation error (instructor-summary):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. GET /api/analytics/total-revenue
// Aggregation Stage: $lookup, $unwind, $group, $project
exports.getTotalRevenue = async (req, res) => {
  try {
    const data = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$courseDetails.price" },
          totalEnrollments: { $sum: 1 },
          averageEnrollmentFee: { $avg: "$courseDetails.price" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalEnrollments: 1,
          averageEnrollmentFee: { $round: ["$averageEnrollmentFee", 2] },
        },
      },
    ]);

    const result = data[0] || { totalRevenue: 0, totalEnrollments: 0, averageEnrollmentFee: 0 };

    res.status(200).json({
      success: true,
      description: "Calculate total revenue by joining enrollments collection with courses collection using $lookup, $unwind, and $group",
      pipeline: [
        { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseDetails" } },
        { $unwind: "$courseDetails" },
        { $group: { _id: null, totalRevenue: { $sum: "$courseDetails.price" }, totalEnrollments: { $sum: 1 }, averageEnrollmentFee: { $avg: "$courseDetails.price" } } },
        { $project: { _id: 0, totalRevenue: 1, totalEnrollments: 1, averageEnrollmentFee: { $round: ["$averageEnrollmentFee", 2] } } },
      ],
      data: result,
    });
  } catch (error) {
    console.error("Aggregation error (total-revenue):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. GET /api/analytics/overview
// Comprehensive stats for the Admin and Analytics Dashboards
exports.getOverview = async (req, res) => {
  try {
    const [totalCourses, totalStudents, totalInstructors, totalEnrollments, avgPriceResult, revenueResult] =
      await Promise.all([
        Course.countDocuments(),
        Student.countDocuments(),
        Instructor.countDocuments(),
        Enrollment.countDocuments(),
        Course.aggregate([
          { $group: { _id: null, avgPrice: { $avg: "$price" }, avgRating: { $avg: "$rating" } } },
        ]),
        Enrollment.aggregate([
          {
            $lookup: {
              from: "courses",
              localField: "course",
              foreignField: "_id",
              as: "courseDetails",
            },
          },
          { $unwind: "$courseDetails" },
          { $group: { _id: null, revenue: { $sum: "$courseDetails.price" } } },
        ]),
      ]);

    const avgPrice = avgPriceResult[0] ? Math.round(avgPriceResult[0].avgPrice) : 0;
    const avgRating = avgPriceResult[0] ? Number(avgPriceResult[0].avgRating.toFixed(1)) : 0;
    const totalRevenue = revenueResult[0] ? revenueResult[0].revenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalInstructors,
        totalEnrollments,
        totalRevenue,
        avgPrice,
        avgRating,
      },
    });
  } catch (error) {
    console.error("Overview stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
