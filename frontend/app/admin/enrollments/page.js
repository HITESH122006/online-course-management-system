"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/enrollments");
      if (!res.ok) throw new Error("Failed to load enrollments from MongoDB");
      const data = await res.json();
      setEnrollments(data.enrollments || []);
    } catch (err) {
      console.error("Fetch enrollments error:", err);
      setError("Failed to connect to backend server. Make sure 'node server.js' is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, studentName, courseTitle) => {
    if (!confirm(`Are you sure you want to cancel the enrollment of ${studentName} in "${courseTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/enrollments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Enrollment successfully deleted from MongoDB Atlas!");
        fetchEnrollments();
      } else {
        setError(data.message || "Failed to delete enrollment");
      }
    } catch (err) {
      setError("Failed to communicate with backend server.");
    }
  };

  return (
    <div className="page-container">
      <div className="admin-page-header">
        <div>
          <div className="crumb-trail">
            <Link href="/admin">Admin</Link> / <span>Enrollment Audit</span>
          </div>
          <h1 className="page-title">Course Enrollments (MongoDB Relations)</h1>
          <p className="page-subtitle">
            Relational junction records linking <code>students</code> and <code>courses</code> collections with compound unique indices.
          </p>
        </div>
        <button onClick={fetchEnrollments} className="btn-refresh">
          🔄 Refresh Enrollments
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
      {success && <ErrorMessage message={success} type="success" onDismiss={() => setSuccess("")} />}

      {loading ? (
        <Loading message="Loading enrollment records from MongoDB..." />
      ) : enrollments.length === 0 ? (
        <div className="empty-box">
          <h3>No course enrollments found in MongoDB</h3>
          <p>Students can enroll via the course details page, or you can run <code>node seed.js</code>.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrolled Course</th>
                <th>Category</th>
                <th>Course Price</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Enrollment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enr) => {
                const studentName = enr.student?.name || "Unknown Student";
                const courseTitle = enr.course?.title || "Deleted Course";

                return (
                  <tr key={enr._id}>
                    <td>
                      <div>
                        <strong>{studentName}</strong>
                        <div className="table-id">{enr.student?.email}</div>
                      </div>
                    </td>
                    <td>
                      <strong>{courseTitle}</strong>
                    </td>
                    <td>
                      <span className="card-category-badge">{enr.course?.category || "N/A"}</span>
                    </td>
                    <td>
                      <strong>₹{enr.course?.price || 0}</strong>
                    </td>
                    <td>
                      <span className={`status-pill status-${(enr.status || "active").toLowerCase()}`}>
                        {enr.status || "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="table-prog-wrap">
                        <span>{enr.progress || 0}%</span>
                        <div className="table-prog-bar">
                          <div className="table-prog-fill" style={{ width: `${enr.progress || 0}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(enr.enrollmentDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(enr._id, studentName, courseTitle)}
                        className="btn-action-delete"
                        title="Cancel enrollment in MongoDB"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
