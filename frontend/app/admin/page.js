"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    avgPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/analytics/overview");
      if (!res.ok) throw new Error("Failed to fetch overview stats");
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Admin stats fetch error:", err);
      setError("Failed to fetch administration stats. Ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="admin-header">
        <div>
          <span className="admin-badge">Admin Control Panel</span>
          <h1 className="admin-title">Online Course Management Portal</h1>
          <p className="admin-sub">
            Central administration hub for managing MongoDB collections, schemas, and analytical reports.
          </p>
        </div>
        <button onClick={fetchStats} className="btn-refresh">
          🔄 Refresh Metrics
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      {loading ? (
        <Loading message="Aggregating collection metrics from MongoDB Atlas..." />
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card card-blue">
              <div className="stat-top">
                <span className="stat-title">Total Courses</span>
                <span className="stat-icon">📚</span>
              </div>
              <div className="stat-number">{stats.totalCourses}</div>
              <div className="stat-sub">Across 6 tech categories</div>
            </div>

            <div className="admin-stat-card card-emerald">
              <div className="stat-top">
                <span className="stat-title">Registered Students</span>
                <span className="stat-icon">👨‍🎓</span>
              </div>
              <div className="stat-number">{stats.totalStudents}</div>
              <div className="stat-sub">Verified accounts</div>
            </div>

            <div className="admin-stat-card card-violet">
              <div className="stat-top">
                <span className="stat-title">Instructors</span>
                <span className="stat-icon">👨‍🏫</span>
              </div>
              <div className="stat-number">{stats.totalInstructors}</div>
              <div className="stat-sub">Active faculty</div>
            </div>

            <div className="admin-stat-card card-amber">
              <div className="stat-top">
                <span className="stat-title">Total Enrollments</span>
                <span className="stat-icon">🎯</span>
              </div>
              <div className="stat-number">{stats.totalEnrollments}</div>
              <div className="stat-sub">Active course registrations</div>
            </div>

            <div className="admin-stat-card card-rose">
              <div className="stat-top">
                <span className="stat-title">Total Platform Revenue</span>
                <span className="stat-icon">💰</span>
              </div>
              <div className="stat-number">₹{stats.totalRevenue?.toLocaleString("en-IN") || 0}</div>
              <div className="stat-sub">Aggregated via $lookup + $unwind</div>
            </div>

            <div className="admin-stat-card card-cyan">
              <div className="stat-top">
                <span className="stat-title">Avg Course Price</span>
                <span className="stat-icon">🏷️</span>
              </div>
              <div className="stat-number">₹{stats.avgPrice || 0}</div>
              <div className="stat-sub">Across all offerings</div>
            </div>
          </div>

          {/* Quick Management Actions */}
          <div className="admin-actions-section">
            <h2>Administrative Management Modules</h2>
            <div className="module-cards-grid">
              <Link href="/admin/courses" className="module-card">
                <div className="module-icon">📚</div>
                <h3>Manage Courses (CRUD)</h3>
                <p>Add new courses, edit existing course attributes, delete documents, and view full MongoDB catalog.</p>
                <span className="module-link">Open Course CRUD &rarr;</span>
              </Link>

              <Link href="/admin/students" className="module-card">
                <div className="module-icon">👨‍🎓</div>
                <h3>Manage Students</h3>
                <p>Inspect registered students, view contact information, and count their enrolled courses.</p>
                <span className="module-link">Open Student Directory &rarr;</span>
              </Link>

              <Link href="/admin/enrollments" className="module-card">
                <div className="module-icon">📝</div>
                <h3>Manage Enrollments</h3>
                <p>Audit course enrollments, track student progress, and remove/cancel student subscriptions.</p>
                <span className="module-link">Open Enrollment Audit &rarr;</span>
              </Link>

              <Link href="/analytics" className="module-card">
                <div className="module-icon">📊</div>
                <h3>MongoDB Aggregation Reports</h3>
                <p>Inspect live aggregation pipelines ($group, $match, $lookup, $unwind) for examiner review.</p>
                <span className="module-link">View Aggregation Reports &rarr;</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
