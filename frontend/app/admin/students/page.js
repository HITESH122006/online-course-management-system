"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/students");
      if (!res.ok) throw new Error("Failed to fetch students from MongoDB");
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error("Fetch students error:", err);
      setError("Failed to connect to backend server. Make sure 'node server.js' is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="admin-page-header">
        <div>
          <div className="crumb-trail">
            <Link href="/admin">Admin</Link> / <span>Student Management</span>
          </div>
          <h1 className="page-title">Registered Students Directory</h1>
          <p className="page-subtitle">
            Records stored in MongoDB <code>students</code> collection with hashed passwords and course references.
          </p>
        </div>
        <button onClick={fetchStudents} className="btn-refresh">
          🔄 Refresh Directory
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      {loading ? (
        <Loading message="Loading student records from MongoDB Atlas..." />
      ) : students.length === 0 ? (
        <div className="empty-box">
          <h3>No students registered yet</h3>
          <p>Register a student through the registration page or seed the database.</p>
          <Link href="/register" className="btn-primary" style={{ marginTop: "12px", display: "inline-block" }}>
            Register New Student
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email Address</th>
                <th>Contact</th>
                <th>Enrolled Courses Count</th>
                <th>Enrolled Course Titles</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div className="table-user-cell">
                      <span className="user-icon">👤</span>
                      <div>
                        <strong>{student.name}</strong>
                        <span className="table-role-badge">{student.role || "student"}</span>
                      </div>
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.phone || "Not Provided"}</td>
                  <td>
                    <span className="enrolled-badge">
                      {student.enrolledCourses ? student.enrolledCourses.length : 0}
                    </span>
                  </td>
                  <td>
                    <div className="course-chips-wrap">
                      {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                        student.enrolledCourses.map((c, idx) => (
                          <span key={idx} className="chip-course">
                            {typeof c === "object" ? c.title : `Course #${idx + 1}`}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </div>
                  </td>
                  <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
