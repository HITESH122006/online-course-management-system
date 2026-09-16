"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("studentUser");
    if (!stored) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setStudent(parsed);
      fetchEnrollments(parsed._id);
    } catch (e) {
      router.push("/login");
    }
  }, []);

  const fetchEnrollments = async (studentId) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/enrollments/student/${studentId}`);
      if (!res.ok) throw new Error("Failed to fetch student enrollments");
      const data = await res.json();
      setEnrollments(data.enrollments || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to load enrolled courses from MongoDB. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (enrollmentId, courseTitle) => {
    if (!confirm(`Are you sure you want to drop your enrollment in "${courseTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/enrollments/${enrollmentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Successfully dropped enrollment in "${courseTitle}". MongoDB updated!`);
        if (student) fetchEnrollments(student._id);
      } else {
        setError(data.message || "Failed to drop enrollment.");
      }
    } catch (err) {
      setError("Error communicating with backend server.");
    }
  };

  if (loading && !student) return <Loading message="Loading student portal..." />;

  return (
    <div className="page-container">
      {/* Student Welcome Header */}
      <div className="dashboard-header">
        <div className="student-profile-strip">
          <div className="student-avatar-big">👨‍🎓</div>
          <div>
            <span className="badge-welcome">Student Dashboard</span>
            <h1 className="dash-title">Welcome back, {student?.name}!</h1>
            <p className="dash-sub">
              📧 {student?.email} {student?.phone && `| 📞 ${student.phone}`}
            </p>
          </div>
        </div>

        <div className="dash-quick-stats">
          <div className="mini-stat">
            <span className="num">{enrollments.length}</span>
            <span className="lbl">Enrolled Courses</span>
          </div>
          <div className="mini-stat">
            <span className="num">
              {enrollments.filter((e) => e.status === "Completed" || e.progress === 100).length}
            </span>
            <span className="lbl">Completed</span>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
      {success && <ErrorMessage message={success} type="success" onDismiss={() => setSuccess("")} />}

      {/* Enrolled Courses Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>My Enrolled Courses ({enrollments.length})</h2>
            <p className="section-sub">Queried from MongoDB <code>enrollments</code> linked to <code>courses</code></p>
          </div>
          <Link href="/courses" className="btn-primary">
            + Enroll in More Courses
          </Link>
        </div>

        {loading ? (
          <Loading message="Syncing enrollments from MongoDB Atlas..." />
        ) : enrollments.length === 0 ? (
          <div className="empty-box">
            <h3>You haven't enrolled in any courses yet</h3>
            <p>Explore our catalog of web development, database, and AI courses to start learning.</p>
            <Link href="/courses" className="btn-primary" style={{ marginTop: "12px", display: "inline-block" }}>
              Explore Available Courses
            </Link>
          </div>
        ) : (
          <div className="enrollments-grid">
            {enrollments.map((item) => {
              const course = item.course;
              if (!course) return null;
              return (
                <div key={item._id} className="enrolled-course-card">
                  <div className="enrolled-card-top">
                    <img
                      src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60"}
                      alt={course.title}
                      className="enrolled-thumb"
                    />
                    <div className="enrolled-info">
                      <span className="card-category-badge">{course.category}</span>
                      <h3 className="enrolled-title">{course.title}</h3>
                      <span className="enrolled-date">
                        Enrolled on: {new Date(item.enrollmentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-block">
                    <div className="progress-labels">
                      <span>Course Progress</span>
                      <span className="progress-perc">{item.progress || 0}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${item.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="enrolled-actions">
                    <Link href={`/courses/${course._id}`} className="btn-continue">
                      Continue Learning →
                    </Link>
                    <button
                      onClick={() => handleCancelEnrollment(item._id, course.title)}
                      className="btn-drop"
                      title="Cancel enrollment in MongoDB"
                    >
                      Drop
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
