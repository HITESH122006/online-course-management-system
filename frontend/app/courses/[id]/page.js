"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get logged-in student
  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (!savedStudent) {
      router.push("/login");
      return;
    }

    try {
      const studentData = JSON.parse(savedStudent);
      setStudent(studentData);
    } catch (error) {
      console.error("Student data error:", error);
      localStorage.removeItem("student");
      router.push("/login");
    }
  }, [router]);

  // Get course details
  useEffect(() => {
    const getCourse = async () => {
      if (!params.id) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/courses/${params.id}`
        );

        const data = await response.json();

        console.log("Course response:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load course"
          );
        }

        setCourse(data.course || data);

      } catch (error) {
        console.error("Course error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getCourse();
  }, [params.id]);

  // Enroll student
  const handleEnroll = async () => {
    if (!student) {
      router.push("/login");
      return;
    }

    if (!course) {
      setError("Course information is not available.");
      return;
    }

    const studentId = student.id || student._id;
    const courseId = course._id || course.id || params.id;

    console.log("Student ID:", studentId);
    console.log("Course ID:", courseId);

    if (!studentId) {
      setError(
        "Student ID not found. Please logout and login again."
      );
      return;
    }

    if (!courseId) {
      setError("Course ID not found.");
      return;
    }

    try {
      setEnrolling(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/enrollments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId: studentId,
            courseId: courseId
          })
        }
      );

      const data = await response.json();

      console.log("Enrollment response:", data);

      if (!response.ok) {
        setError(
          data.message || "Enrollment failed"
        );
        return;
      }

      setMessage(
        data.message || "Course enrollment successful!"
      );

      // Go to My Enrollments
      setTimeout(() => {
        router.push("/enrollments");
      }, 1000);

    } catch (error) {
      console.error("Enrollment error:", error);

      setError(
        "Unable to connect to the enrollment server."
      );
    } finally {
      setEnrolling(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Course...</h2>
      </div>
    );
  }

  // Course error
  if (error && !course) {
    return (
      <div style={styles.center}>
        <h2>Course Not Found</h2>

        <p style={styles.error}>
          {error}
        </p>

        <button
          onClick={() => router.push("/courses")}
          style={styles.button}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  // No course
  if (!course) {
    return (
      <div style={styles.center}>
        <h2>Course Not Found</h2>

        <button
          onClick={() => router.push("/courses")}
          style={styles.button}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const instructor =
    typeof course.instructor === "object"
      ? course.instructor?.name
      : course.instructorName ||
        course.instructor ||
        "Not assigned";

  return (
    <div style={styles.container}>

      {/* Header */}
      <header style={styles.header}>
        <h1>
          Online Course Management System
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          style={styles.dashboardButton}
        >
          Dashboard
        </button>
      </header>

      {/* Main */}
      <main style={styles.main}>

        <button
          onClick={() => router.push("/courses")}
          style={styles.backButton}
        >
          ← Back to Courses
        </button>

        <div style={styles.card}>

          <h2 style={styles.title}>
            {course.title || course.name}
          </h2>

          <p style={styles.description}>
            {course.description ||
              "No description available."}
          </p>

          <div style={styles.infoContainer}>

            <div style={styles.infoBox}>
              <h3>Category</h3>
              <p>
                {course.category ||
                  "Not specified"}
              </p>
            </div>

            <div style={styles.infoBox}>
              <h3>Duration</h3>
              <p>
                {course.duration ||
                  "Not specified"}
              </p>
            </div>

            <div style={styles.infoBox}>
              <h3>Instructor</h3>
              <p>{instructor}</p>
            </div>

          </div>

          {/* Success message */}
          {message && (
            <div style={styles.success}>
              {message}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          {/* Enroll button */}
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            style={{
              ...styles.enrollButton,
              opacity: enrolling ? 0.6 : 1
            }}
          >
            {enrolling
              ? "Enrolling..."
              : "Enroll Now"}
          </button>

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

  dashboardButton: {
    background: "white",
    color: "#2563eb",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  },

  main: {
    maxWidth: "950px",
    margin: "40px auto",
    padding: "20px"
  },

  backButton: {
    background: "transparent",
    border: "none",
    color: "#2563eb",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px"
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.1)"
  },

  title: {
    fontSize: "32px",
    color: "#222",
    marginBottom: "15px"
  },

  description: {
    fontSize: "17px",
    lineHeight: "1.6",
    color: "#555",
    marginBottom: "30px"
  },

  infoContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "30px"
  },

  infoBox: {
    background: "#f4f7fb",
    padding: "18px",
    borderRadius: "8px"
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center"
  },

  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center"
  },

  error: {
    color: "#dc2626",
    marginBottom: "20px"
  },

  enrollButton: {
    width: "100%",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "7px",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer"
  },

  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px"
  }
};