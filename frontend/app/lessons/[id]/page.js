"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LessonDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const lessonId = params.id;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/lessons/${lessonId}`
      );

      const data = await response.json();

      console.log("Lesson API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load lesson"
        );
      }

      setLesson(data.lesson);
    } catch (error) {
      console.error("Lesson Error:", error);

      setError(
        error.message || "Unable to load lesson."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
  router.push("/lessons");
};

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Lesson...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.errorBox}>
          <h2>Unable to Load Lesson</h2>
          <p>{error}</p>

          <button
            onClick={() => router.push("/enrollments")}
            style={styles.button}
          >
            Back to My Enrollments
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={styles.center}>
        <h2>Lesson not found.</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <header style={styles.header}>

        <h1 style={styles.headerTitle}>
          Online Course Management System
        </h1>

        <div style={styles.headerButtons}>

          <button
            onClick={() => router.push("/dashboard")}
            style={styles.headerButton}
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/enrollments")}
            style={styles.headerButton}
          >
            My Enrollments
          </button>

        </div>

      </header>

      <main style={styles.main}>

        <button
          onClick={handleBack}
          style={styles.backButton}
        >
          ← Back to Lessons
        </button>

        <div style={styles.lessonCard}>

          <div style={styles.lessonNumber}>
            Lesson {lesson.lessonNumber}
          </div>

          <h2 style={styles.lessonTitle}>
            {lesson.title}
          </h2>

          <p style={styles.description}>
            {lesson.description}
          </p>

          {lesson.course && (
            <div style={styles.courseInfo}>
              <h3>Course</h3>
              <p>{lesson.course.title}</p>
            </div>
          )}

          <div style={styles.infoBox}>
            <strong>Duration:</strong>

            <span>
              {lesson.duration || "30 Minutes"}
            </span>
          </div>

          <div style={styles.videoBox}>

            <div style={styles.playIcon}>
              ▶
            </div>

            <h3>Lesson Video</h3>

            {lesson.videoUrl ? (
              <p>
                Video available for this lesson.
              </p>
            ) : (
              <p>
                No video has been added for this lesson yet.
              </p>
            )}

          </div>

          <button
            onClick={() =>
              alert("Lesson completed!")
            }
            style={styles.completeButton}
          >
            ✓ Mark Lesson as Complete
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

  headerTitle: {
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
    maxWidth: "900px",
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

  lessonCard: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)"
  },

  lessonNumber: {
    color: "#2563eb",
    fontWeight: "600",
    marginBottom: "10px"
  },

  lessonTitle: {
    fontSize: "32px",
    color: "#222",
    marginBottom: "15px"
  },

  description: {
    color: "#555",
    fontSize: "17px",
    lineHeight: "1.6",
    marginBottom: "25px"
  },

  courseInfo: {
    background: "#f4f7fb",
    padding: "18px",
    borderRadius: "8px",
    marginBottom: "20px"
  },

  infoBox: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "25px"
  },

  videoBox: {
    minHeight: "280px",
    background: "#111827",
    color: "white",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "25px",
    textAlign: "center",
    padding: "20px"
  },

  playIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "25px",
    marginBottom: "15px"
  },

  completeButton: {
    width: "100%",
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  },

  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  errorBox: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)"
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};