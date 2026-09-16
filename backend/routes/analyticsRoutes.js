const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// MongoDB Aggregation routes
router.get("/courses-by-category", analyticsController.getCoursesByCategory);
router.get("/average-price", analyticsController.getAveragePriceByCategory);
router.get("/course-enrollments", analyticsController.getCourseEnrollments);
router.get("/instructor-summary", analyticsController.getInstructorSummary);
router.get("/total-revenue", analyticsController.getTotalRevenue);
router.get("/overview", analyticsController.getOverview);

module.exports = router;
