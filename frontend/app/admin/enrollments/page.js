"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EnrollmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudentAndEnrollments();
  }, []);

  const loadStudentAndEnrollments = async () => {
    try {
      const savedStudent =
        localStorage.getItem("student");

      if (!savedStudent) {
        router.push("/login");
        return;
      }

      const studentData =
        JSON.parse(savedStudent);

      setStudent(studentData);

      const studentId =
        studentData.id || studentData._id;

      if (!studentId) {
        setError(
          "Student ID not found. Please login again."
        );
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/enrollments/student/${studentId}`
      );

      const data = await response.json();

      console.log(
        "Enrollment API Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load enrollments"
        );
      }

      setEnrollments(
        data.enrollments || []
      );

    } catch (error) {
      console.error(
        "Enrollment loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load enrollments."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleViewLessons = (courseId) => {
    if (!courseId) {
      alert("Course ID not found.");
      return;
    }

    router.push(
      `/lessons?courseId=${courseId}`
    );
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading My Enrollments...</h2>
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
              router.push("/courses")
            }
            style={styles.headerButton}
          >
            Courses
          </button>

        </div>

      </header>

      {/* Main */}
      <main style={styles.main}>

        <h2 style={styles.heading}>
          My Enrollments
        </h2>

        {student && (
          <p style={styles.welcome}>
            Welcome, {student.name}
          </p>
        )}

        {error && (
          <div style={styles.error}>
            {error}

            <br />

            <button
              onClick={loadStudentAndEnrollments}
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )}

        {!error &&
          enrollments.length === 0 && (
            <div style={styles.emptyCard}>

              <h3>
                No Enrollments Found
              </h3>

              <p>
                You have not enrolled in
                any courses yet.
              </p>

              <button
                onClick={() =>
                  router.push("/courses")
                }
                style={styles.courseButton}
              >
                Browse Courses
              </button>

            </div>
          )}

        {enrollments.length > 0 && (
          <div style={styles.grid}>

            {enrollments.map(
              (enrollment) => {

                const course =
                  enrollment.course;

                const courseId =
                  course?._id ||
                  course?.id;

                const progress =
                  enrollment.progress || 0;

                return (
                  <div
                    key={enrollment._id}
                    style={styles.card}
                  >

                    <h3 style={styles.courseTitle}>
                      {course?.title ||
                        "Course"}
                    </h3>

                    <p style={styles.description}>
                      {course?.description ||
                        "No description available."}
                    </p>

                    <div style={styles.info}>

                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {course?.category ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Duration:
                        </strong>{" "}
                        {course?.duration ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Instructor:
                        </strong>{" "}
                        {course?.instructorName ||
                          course?.displayInstructor ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        {enrollment.status ||
                          "Active"}
                      </p>

                    </div>

                    {/* Progress */}
                    <div style={styles.progressSection}>

                      <div
                        style={
                          styles.progressHeader
                        }
                      >
                        <strong>
                          Progress
                        </strong>

                        <span>
                          {progress}%
                        </span>
                      </div>

                      <div
                        style={
                          styles.progressBackground
                        }
                      >
                        <div
                          style={{
                            ...styles.progressBar,
                            width: `${progress}%`
                          }}
                        />
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        handleViewLessons(
                          courseId
                        )
                      }
                      style={styles.lessonButton}
                    >
                      View Lessons
                    </button>

                  </div>
                );
              }
            )}

          </div>
        )}

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

  welcome: {
    color: "#666",
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
    marginBottom: "12px"
  },

  description: {
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "20px"
  },

  info: {
    color: "#444",
    lineHeight: "1.7"
  },

  progressSection: {
    marginTop: "20px",
    marginBottom: "20px"
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },

  progressBackground: {
    width: "100%",
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden"
  },

  progressBar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "10px"
  },

  lessonButton: {
    width: "100%",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  },

  emptyCard: {
    background: "white",
    padding: "50px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.1)"
  },

  courseButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px"
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "20px"
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

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};