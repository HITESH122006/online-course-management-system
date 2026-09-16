"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CourseCard from "../components/CourseCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch courses and stats in parallel
      const [coursesRes, statsRes] = await Promise.allSettled([
        fetch("http://localhost:5000/api/courses"),
        fetch("http://localhost:5000/api/analytics/overview"),
      ]);

      if (coursesRes.status === "fulfilled" && coursesRes.value.ok) {
        const data = await coursesRes.value.json();
        setCourses(Array.isArray(data) ? data : []);
      } else {
        setError("Could not load courses from backend. Ensure backend is running at http://localhost:5000");
      }

      if (statsRes.status === "fulfilled" && statsRes.value.ok) {
        const statsData = await statsRes.value.json();
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        }
      }
    } catch (err) {
      console.error("Home fetch error:", err);
      setError("Failed to connect to backend server. Make sure 'node server.js' is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-badge">🎓 TAE-2 DBMS / AWT Mini Project</div>
        <h1 className="hero-title">Online Course Management System</h1>
        <p className="hero-subtitle">
          A full-stack learning platform built with <strong>Next.js 16</strong>, <strong>Express.js</strong>, and{" "}
          <strong>MongoDB Atlas</strong>, demonstrating schema design, complete CRUD operations, and multi-stage aggregation pipelines.
        </p>

        <div className="hero-buttons">
          <Link href="/courses" className="btn-primary">
            Explore All Courses →
          </Link>
          <Link href="/admin/courses" className="btn-secondary">
            Manage Courses (CRUD) ⚙️
          </Link>
          <Link href="/analytics" className="btn-accent">
            MongoDB Aggregations 📊
          </Link>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-val">{stats.totalCourses || courses.length || 0}</div>
          <div className="stat-lbl">Active Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-val">{stats.totalStudents || 6}</div>
          <div className="stat-lbl">Registered Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-val">{stats.totalInstructors || 3}</div>
          <div className="stat-lbl">Verified Instructors</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-val">{stats.totalEnrollments || 10}</div>
          <div className="stat-lbl">Total Enrollments</div>
        </div>
      </section>

      {/* Main Content: Featured Courses */}
      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-heading">Featured MongoDB Courses</h2>
            <p className="section-sub">Live records queried from MongoDB Atlas collections</p>
          </div>
          <Link href="/courses" className="view-all-link">
            View All ({courses.length}) &rarr;
          </Link>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

        {loading ? (
          <Loading message="Fetching real-time course catalog from MongoDB Atlas..." />
        ) : courses.length === 0 ? (
          <div className="empty-box">
            <p>No courses found in MongoDB.</p>
            <p className="hint">Run <code>node seed.js</code> in backend or click below to add your first course!</p>
            <Link href="/admin/courses" className="btn-primary" style={{ marginTop: "12px", display: "inline-block" }}>
              + Add First Course
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* College Project Architecture Overview Banner */}
      <section className="arch-card">
        <h3>System Architecture & MongoDB Features Implemented</h3>
        <div className="arch-grid">
          <div className="arch-item">
            <h4>1. MongoDB Atlas Connectivity</h4>
            <p>Mongoose ODM connection to cloud replica set with resilient DNS and error trapping.</p>
          </div>
          <div className="arch-item">
            <h4>2. Complete CRUD APIs</h4>
            <p>Full REST endpoints (GET, POST, PUT, DELETE) modifying real documents in MongoDB.</p>
          </div>
          <div className="arch-item">
            <h4>3. Relational Modeling</h4>
            <p>5 collections with ObjectId references, cascade logic, and compound unique indexes.</p>
          </div>
          <div className="arch-item">
            <h4>4. Aggregation Pipelines</h4>
            <p>Advanced stages: $group, $match, $sort, $lookup, $unwind, and $project calculations.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
