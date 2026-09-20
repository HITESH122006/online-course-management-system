"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/courses"
      );

      const data = await response.json();

      console.log("Courses API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load courses"
        );
      }

      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses(data.courses || []);
      }

    } catch (error) {
      console.error("Courses Error:", error);

      setError(
        error.message ||
          "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (course) => {
    const courseId =
      course._id || course.id;

    if (!courseId) {
      alert("Course ID not found.");
      return;
    }

    router.push(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Courses...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <header style={styles.header}>

        <h1>
          Online Course Management System
        </h1>

        <div style={styles.headerButtons}>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            style={styles.headerButton}
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              router.push("/enrollments")
            }
            style={styles.headerButton}
          >
            My Enrollments
          </button>

        </div>

      </header>

      {/* Main */}
      <main style={styles.main}>

        <h2 style={styles.heading}>
          Available Courses
        </h2>

        <p style={styles.subtitle}>
          Browse our available courses and
          start learning today.
        </p>

        {error && (
          <div style={styles.error}>
            <strong>Error:</strong> {error}

            <br />

            <button
              onClick={fetchCourses}
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )}

        {!error && courses.length === 0 && (
          <div style={styles.empty}>
            <h3>No Courses Available</h3>

            <p>
              There are currently no courses
              available.
            </p>
          </div>
        )}

        <div style={styles.grid}>

          {courses.map((course) => (

            <div
              key={course._id || course.id}
              style={styles.card}
            >

              {/* Course Title */}
              <h3 style={styles.courseTitle}>
                {course.title ||
                  course.name ||
                  "Untitled Course"}
              </h3>

              {/* Description */}
              <p style={styles.description}>
                {course.description ||
                  "No description available."}
              </p>

              {/* Course Information */}
              <div style={styles.info}>

                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {course.category ||
                    "Not specified"}
                </p>

                <p>
                  <strong>
                    Duration:
                  </strong>{" "}
                  {course.duration ||
                    "Not specified"}
                </p>

                <p>
                  <strong>
                    Instructor:
                  </strong>{" "}
                  {course.instructorName ||
                    course.displayInstructor ||
                    (
                      typeof course.instructor ===
                      "object"
                        ? course.instructor?.name
                        : course.instructor
                    ) ||
                    "Not assigned"}
                </p>

              </div>

              {/* View Course */}
              <button
                onClick={() =>
                  handleViewCourse(course)
                }
                style={styles.viewButton}
              >
                View Course
              </button>

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f7fb"
  },

  header: {
    background: "#2563eb",
    color: "white",
    padding: "18px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  headerButtons: {
    display: "flex",
    gap: "10px"
  },

  headerButton: {
    background: "white",
    color: "#2563eb",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  },

  main: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "20px"
  },

  heading: {
    fontSize: "32px",
    color: "#222",
    marginBottom: "8px"
  },

  subtitle: {
    color: "#666",
    fontSize: "17px",
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "25px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.1)"
  },

  courseTitle: {
    fontSize: "22px",
    color: "#2563eb",
    marginBottom: "15px"
  },

  description: {
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "20px"
  },

  info: {
    color: "#444",
    lineHeight: "1.7",
    marginBottom: "20px"
  },

  viewButton: {
    width: "100%",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px"
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "25px"
  },

  retryButton: {
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  empty: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center"
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};