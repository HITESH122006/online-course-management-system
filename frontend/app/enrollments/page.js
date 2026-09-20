"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EnrollmentsPage() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError("");

      const savedStudent =
        localStorage.getItem("student");

      if (!savedStudent) {
        router.push("/login");
        return;
      }

      const studentData =
        JSON.parse(savedStudent);

      console.log(
        "Logged-in student:",
        studentData
      );

      setStudent(studentData);

      // IMPORTANT:
      // MongoDB ID is required here.
      const studentId =
        studentData.id ||
        studentData._id;

      console.log(
        "Student MongoDB ID:",
        studentId
      );

      if (
        !studentId ||
        studentId === "..." ||
        studentId.length !== 24
      ) {
        setError(
          "Invalid MongoDB student ID. Please logout and login again."
        );
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/enrollments/student/${studentId}`
      );

      const data =
        await response.json();

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
        "Enrollment Error:",
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

  const handleViewLessons = (
    courseId
  ) => {
    if (!courseId) {
      alert("Course ID not found.");
      return;
    }

    router.push(
      `/lessons?courseId=${courseId}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>
          Loading My Enrollments...
        </h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <header style={styles.header}>

        <h1 style={styles.title}>
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

          <button
            onClick={handleLogout}
            style={styles.headerButton}
          >
            Logout
          </button>

        </div>

      </header>

      <main style={styles.main}>

        <button
          onClick={() =>
            router.push("/courses")
          }
          style={styles.backButton}
        >
          ← Back to Courses
        </button>

        <h2 style={styles.heading}>
          My Enrollments
        </h2>

        {student && (
          <p style={styles.welcome}>
            Welcome, {student.name}!
          </p>
        )}

        {error && (
          <div style={styles.error}>
            <strong>Error:</strong>{" "}
            {error}

            <br />

            <button
              onClick={handleLogout}
              style={styles.retryButton}
            >
              Logout and Login Again
            </button>
          </div>
        )}

        {!error &&
          enrollments.length === 0 && (
            <div style={styles.empty}>

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
                  enrollment.progress ||
                  0;

                return (
                  <div
                    key={
                      enrollment._id
                    }
                    style={styles.card}
                  >

                    <h3
                      style={
                        styles.courseTitle
                      }
                    >
                      {course?.title ||
                        "Course"}
                    </h3>

                    <p
                      style={
                        styles.description
                      }
                    >
                      {course?.description ||
                        "No description available."}
                    </p>

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
                        course?.instructor?.name ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>
                        Status:
                      </strong>{" "}
                      {enrollment.status ||
                        "Active"}
                    </p>

                    <div
                      style={
                        styles.progressSection
                      }>

                      <div
                        style={
                          styles.progressHeader
                        }>
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
                        }>
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
                      style={
                        styles.lessonButton
                      }
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

  title: {
    margin: 0,
    fontSize: "24px"
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

  backButton: {
    background: "transparent",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px"
  },

  heading: {
    fontSize: "32px",
    color: "#222",
    marginBottom: "8px"
  },

  welcome: {
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
    marginBottom: "12px"
  },

  description: {
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "20px"
  },

  progressSection: {
    marginTop: "20px",
    marginBottom: "20px"
  },

  progressHeader: {
    display: "flex",
    justifyContent:
      "space-between",
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

  empty: {
    background: "white",
    padding: "50px",
    borderRadius: "10px",
    textAlign: "center"
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
    borderRadius: "8px",
    marginBottom: "20px"
  },

  retryButton: {
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
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