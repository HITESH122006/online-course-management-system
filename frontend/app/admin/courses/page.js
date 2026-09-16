"use client";

import { useState, useEffect } from "react";
import CourseForm from "../../../components/CourseForm";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import Link from "next/link";

export default function AdminCoursesCRUDPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // CRUD UI states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchCourses();
  }, [categoryFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      let url = "http://localhost:5000/api/courses";
      const params = new URLSearchParams();
      if (categoryFilter !== "All") params.append("category", categoryFilter);
      if (search.trim()) params.append("search", search.trim());
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load courses from MongoDB API");
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch courses error:", err);
      setError("Failed to connect to backend server. Make sure 'node server.js' is running.");
    } finally {
      setLoading(false);
    }
  };

  // C - CREATE
  const handleCreateCourse = async (courseData) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create course in MongoDB");
      }

      setSuccess(`Course "${courseData.title}" successfully inserted into MongoDB Atlas!`);
      setShowAddModal(false);
      fetchCourses(); // Refresh live data
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // U - UPDATE
  const handleUpdateCourse = async (courseData) => {
    if (!editingCourse) return;
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${editingCourse._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update course in MongoDB");
      }

      setSuccess(`Course "${courseData.title}" successfully updated in MongoDB Atlas!`);
      setEditingCourse(null);
      fetchCourses(); // Refresh live data
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // D - DELETE
  const handleDeleteCourse = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}" permanently from MongoDB Atlas?`)) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete course");
      }

      setSuccess(`Course "${title}" and associated data permanently deleted from MongoDB Atlas!`);
      fetchCourses(); // Refresh live data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="admin-page-header">
        <div>
          <div className="crumb-trail">
            <Link href="/admin">Admin</Link> / <span>Course CRUD Management</span>
          </div>
          <h1 className="page-title">Course Management (CRUD Operations)</h1>
          <p className="page-subtitle">
            Create, Read, Update, and Delete course records directly stored in MongoDB Atlas <code>courses</code> collection.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCourse(null);
            setShowAddModal(true);
          }}
          className="btn-add-course"
        >
          + Add New Course (POST)
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
      {success && <ErrorMessage message={success} type="success" onDismiss={() => setSuccess("")} />}

      {/* Search and Category Filter Toolbar */}
      <div className="crud-toolbar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="🔍 Search by course title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>

        <div className="filter-select-box">
          <label>Filter Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="Database">Database</option>
            <option value="Data Science">Data Science</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Cloud Computing">Cloud Computing</option>
          </select>
        </div>

        <button onClick={() => { setSearch(""); setCategoryFilter("All"); fetchCourses(); }} className="btn-reset">
          Reset
        </button>
      </div>

      {/* Modal / Inline Add Form */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Course (MongoDB insertOne)</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close">
                &times;
              </button>
            </div>
            <CourseForm
              onSubmit={handleCreateCourse}
              onCancel={() => setShowAddModal(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Modal / Inline Edit Form */}
      {editingCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Course: {editingCourse.title} (MongoDB findByIdAndUpdate)</h2>
              <button onClick={() => setEditingCourse(null)} className="modal-close">
                &times;
              </button>
            </div>
            <CourseForm
              initialData={editingCourse}
              onSubmit={handleUpdateCourse}
              onCancel={() => setEditingCourse(null)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Courses Data Table */}
      {loading ? (
        <Loading message="Querying courses from MongoDB Atlas..." />
      ) : courses.length === 0 ? (
        <div className="empty-box">
          <h3>No courses found in MongoDB</h3>
          <p>Click "Add New Course" above or execute <code>node seed.js</code> in the backend directory.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Category</th>
                <th>Instructor</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Level</th>
                <th>Rating</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const instructor =
                  course.instructor && typeof course.instructor === "object"
                    ? course.instructor.name
                    : course.instructorName || "Senior Instructor";

                return (
                  <tr key={course._id}>
                    <td>
                      <div className="table-course-title">
                        <img
                          src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60"}
                          alt=""
                          className="table-thumb"
                        />
                        <div>
                          <strong>{course.title}</strong>
                          <span className="table-id">ID: {course._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="card-category-badge">{course.category}</span>
                    </td>
                    <td>{instructor}</td>
                    <td>{course.duration}</td>
                    <td>
                      <strong className="table-price">₹{course.price}</strong>
                    </td>
                    <td>
                      <span className={`card-level-badge level-${(course.level || "Beginner").toLowerCase()}`}>
                        {course.level || "Beginner"}
                      </span>
                    </td>
                    <td>⭐ {course.rating ? Number(course.rating).toFixed(1) : "4.5"}</td>
                    <td>
                      <span className="enrolled-badge">{course.studentsEnrolled || 0}</span>
                    </td>
                    <td>
                      <div className="table-action-btns">
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="btn-action-edit"
                          title="Edit course in MongoDB"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id, course.title)}
                          className="btn-action-delete"
                          title="Delete course from MongoDB"
                        >
                          🗑️ Delete
                        </button>
                      </div>
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
