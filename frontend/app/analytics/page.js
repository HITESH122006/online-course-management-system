"use client";

import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Link from "next/link";

export default function AnalyticsPage() {
  const [coursesByCategory, setCoursesByCategory] = useState([]);
  const [averagePrices, setAveragePrices] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [instructorSummary, setInstructorSummary] = useState([]);
  const [revenueData, setRevenueData] = useState({ totalRevenue: 0, totalEnrollments: 0, averageEnrollmentFee: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const [catRes, priceRes, popRes, instRes, revRes] = await Promise.all([
        fetch("http://localhost:5000/api/analytics/courses-by-category"),
        fetch("http://localhost:5000/api/analytics/average-price"),
        fetch("http://localhost:5000/api/analytics/course-enrollments"),
        fetch("http://localhost:5000/api/analytics/instructor-summary"),
        fetch("http://localhost:5000/api/analytics/total-revenue"),
      ]);

      const [catData, priceData, popData, instData, revData] = await Promise.all([
        catRes.json(),
        priceRes.json(),
        popRes.json(),
        instRes.json(),
        revRes.json(),
      ]);

      setCoursesByCategory(catData.data || []);
      setAveragePrices(priceData.data || []);
      setPopularCourses(popData.data || []);
      setInstructorSummary(instData.data || []);
      setRevenueData(revData.data || { totalRevenue: 0, totalEnrollments: 0, averageEnrollmentFee: 0 });
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError("Failed to fetch aggregation reports. Make sure backend server is running on http://localhost:5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="admin-header">
        <div>
          <span className="admin-badge">Database Management Systems</span>
          <h1 className="admin-title">MongoDB Aggregation Framework Reports</h1>
          <p className="admin-sub">
            Real-time analytical pipelines computed using MongoDB stages: <code>$group</code>, <code>$lookup</code>, <code>$unwind</code>, <code>$sort</code>, and <code>$project</code>.
          </p>
        </div>
        <button onClick={fetchAllAnalytics} className="btn-refresh">
          🔄 Re-run Aggregations
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      {loading ? (
        <Loading message="Executing MongoDB Aggregation Pipelines in Atlas..." />
      ) : (
        <div className="analytics-layout">
          {/* Revenue Aggregation Card */}
          <div className="report-card report-card-highlight">
            <div className="report-card-header">
              <div>
                <span className="query-tag">Aggregation #1: Relational $lookup + $unwind</span>
                <h3>Total Platform Revenue & Financial Summary</h3>
              </div>
              <span className="stage-pill">$lookup &rarr; $unwind &rarr; $group</span>
            </div>

            <div className="revenue-stats-row">
              <div className="rev-box">
                <span className="rev-lbl">Total Revenue Generated</span>
                <span className="rev-val">₹{revenueData.totalRevenue?.toLocaleString("en-IN") || 0}</span>
                <span className="rev-hint">Sum of enrolled course prices</span>
              </div>
              <div className="rev-box">
                <span className="rev-lbl">Total Paid Enrollments</span>
                <span className="rev-val">{revenueData.totalEnrollments || 0}</span>
                <span className="rev-hint">Validated active records</span>
              </div>
              <div className="rev-box">
                <span className="rev-lbl">Avg Fee Per Enrollment</span>
                <span className="rev-val">₹{revenueData.averageEnrollmentFee || 0}</span>
                <span className="rev-hint">Computed via $avg</span>
              </div>
            </div>

            <div className="pipeline-code-block">
              <span className="code-lbl">MongoDB Shell Aggregation Pipeline:</span>
              <pre>
{`db.enrollments.aggregate([
  {
    $lookup: {
      from: "courses",
      localField: "course",
      foreignField: "_id",
      as: "courseDetails"
    }
  },
  { $unwind: "$courseDetails" },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$courseDetails.price" },
      totalEnrollments: { $sum: 1 },
      averageEnrollmentFee: { $avg: "$courseDetails.price" }
    }
  }
])`}
              </pre>
            </div>
          </div>

          <div className="analytics-grid-two">
            {/* Aggregation #2: Courses by Category */}
            <div className="report-card">
              <div className="report-card-header">
                <div>
                  <span className="query-tag">Aggregation #2: $group + $sum</span>
                  <h3>Course Distribution by Category</h3>
                </div>
              </div>

              <div className="table-responsive">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Courses</th>
                      <th>Price Range (Min - Max)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesByCategory.map((cat) => (
                      <tr key={cat._id}>
                        <td>
                          <span className="card-category-badge">{cat._id}</span>
                        </td>
                        <td>
                          <strong>{cat.totalCourses} courses</strong>
                        </td>
                        <td>
                          ₹{cat.minPrice} - ₹{cat.maxPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pipeline-code-block">
                <span className="code-lbl">Pipeline:</span>
                <pre>
{`db.courses.aggregate([
  {
    $group: {
      _id: "$category",
      totalCourses: { $sum: 1 },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" }
    }
  },
  { $sort: { totalCourses: -1 } }
])`}
                </pre>
              </div>
            </div>

            {/* Aggregation #3: Average Price by Category */}
            <div className="report-card">
              <div className="report-card-header">
                <div>
                  <span className="query-tag">Aggregation #3: $group + $avg + $sort</span>
                  <h3>Average Course Price by Category</h3>
                </div>
              </div>

              <div className="table-responsive">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Average Course Price</th>
                      <th>Course Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {averagePrices.map((item) => (
                      <tr key={item.category}>
                        <td>
                          <strong>{item.category}</strong>
                        </td>
                        <td>
                          <span className="price-tag-table">₹{item.averagePrice}</span>
                        </td>
                        <td>{item.totalCourses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pipeline-code-block">
                <span className="code-lbl">Pipeline:</span>
                <pre>
{`db.courses.aggregate([
  {
    $group: {
      _id: "$category",
      averagePrice: { $avg: "$price" },
      totalCourses: { $sum: 1 }
    }
  },
  {
    $project: {
      category: "$_id",
      averagePrice: { $round: ["$averagePrice", 2] },
      totalCourses: 1,
      _id: 0
    }
  },
  { $sort: { averagePrice: -1 } }
])`}
                </pre>
              </div>
            </div>
          </div>

          <div className="analytics-grid-two">
            {/* Aggregation #4: Popular Courses by Enrollment */}
            <div className="report-card">
              <div className="report-card-header">
                <div>
                  <span className="query-tag">Aggregation #4: $project + $sort + $limit</span>
                  <h3>Top Popular Courses (By Enrollment)</h3>
                </div>
              </div>

              <div className="table-responsive">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Students</th>
                      <th>Rating</th>
                      <th>Est. Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularCourses.slice(0, 5).map((course, idx) => (
                      <tr key={course._id || idx}>
                        <td>
                          <strong>{course.title}</strong>
                        </td>
                        <td>
                          <span className="enrolled-badge">{course.studentsEnrolled}</span>
                        </td>
                        <td>⭐ {course.rating ? Number(course.rating).toFixed(1) : "4.5"}</td>
                        <td>
                          <strong>₹{course.estimatedRevenue?.toLocaleString("en-IN") || 0}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pipeline-code-block">
                <span className="code-lbl">Pipeline:</span>
                <pre>
{`db.courses.aggregate([
  {
    $project: {
      title: 1,
      category: 1,
      studentsEnrolled: 1,
      rating: 1,
      estimatedRevenue: { $multiply: ["$price", "$studentsEnrolled"] }
    }
  },
  { $sort: { studentsEnrolled: -1 } },
  { $limit: 5 }
])`}
                </pre>
              </div>
            </div>

            {/* Aggregation #5: Instructor Summary */}
            <div className="report-card">
              <div className="report-card-header">
                <div>
                  <span className="query-tag">Aggregation #5: $group by Instructor</span>
                  <h3>Faculty & Instructor Performance</h3>
                </div>
              </div>

              <div className="table-responsive">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Instructor</th>
                      <th>Courses Taught</th>
                      <th>Total Students</th>
                      <th>Average Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructorSummary.map((inst) => (
                      <tr key={inst.instructor}>
                        <td>
                          <strong>{inst.instructor}</strong>
                        </td>
                        <td>{inst.totalCourses}</td>
                        <td>
                          <span className="enrolled-badge">{inst.totalStudents}</span>
                        </td>
                        <td>⭐ {inst.averageRating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pipeline-code-block">
                <span className="code-lbl">Pipeline:</span>
                <pre>
{`db.courses.aggregate([
  {
    $group: {
      _id: "$instructorName",
      totalCourses: { $sum: 1 },
      totalStudents: { $sum: "$studentsEnrolled" },
      averageRating: { $avg: "$rating" }
    }
  },
  {
    $project: {
      instructor: "$_id",
      totalCourses: 1,
      totalStudents: 1,
      averageRating: { $round: ["$averageRating", 2] },
      _id: 0
    }
  },
  { $sort: { totalStudents: -1 } }
])`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
