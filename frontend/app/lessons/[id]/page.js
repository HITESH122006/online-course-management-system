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

  const [enrollment, setEnrollment] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [message, setMessage] = useState("");
  const [updating, setUpdating] = useState(false);

  // ==========================================
  // GET LESSON
  // ==========================================

  useEffect(() => {
    if (!lessonId) {
      return;
    }

    async function getLesson() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/lessons/" + lessonId
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load lesson"
          );
        }

        setLesson(data.lesson);
      } catch (err) {
        console.error("Lesson Error:", err);

        setError(
          err.message || "Unable to load lesson"
        );
      } finally {
        setLoading(false);
      }
    }

    getLesson();
  }, [lessonId]);

  // ==========================================
  // GET STUDENT ENROLLMENT
  // ==========================================

  useEffect(() => {
    if (!lesson || !lesson.course) {
      return;
    }

    async function getEnrollment() {
      try {
        const savedStudent =
          localStorage.getItem("student");

        if (!savedStudent) {
          router.push("/login");
          return;
        }

        const student = JSON.parse(savedStudent);

        const studentId =
          student.id ||
          student._id ||
          student.studentId;

        if (!studentId) {
          setMessage(
            "Student information not found. Please login again."
          );
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/enrollments/student/" +
            studentId
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to get enrollment"
          );
        }

        const enrollments =
          data.enrollments || [];

        let courseEnrollment = null;

        for (let i = 0; i < enrollments.length; i++) {
          const item = enrollments[i];

          const enrolledCourse = item.course;

          let enrolledCourseId = "";

          if (
            enrolledCourse &&
            enrolledCourse._id
          ) {
            enrolledCourseId =
              enrolledCourse._id.toString();
          } else if (enrolledCourse) {
            enrolledCourseId =
              enrolledCourse.toString();
          }

          if (
            enrolledCourseId ===
            lesson.course._id.toString()
          ) {
            courseEnrollment = item;
            break;
          }
        }

        if (!courseEnrollment) {
          setEnrollment(null);
          setProgress(0);
          setCompleted(false);

          setMessage(
            "You are not enrolled in this course."
          );

          return;
        }

        setEnrollment(courseEnrollment);

        setProgress(
          Number(courseEnrollment.progress) || 0
        );

        const completedLessons =
          courseEnrollment.completedLessons || [];

        let isCompleted = false;

        for (
          let i = 0;
          i < completedLessons.length;
          i++
        ) {
          const completedLesson =
            completedLessons[i];

          let completedLessonId = "";

          if (
            completedLesson &&
            completedLesson._id
          ) {
            completedLessonId =
              completedLesson._id.toString();
          } else if (completedLesson) {
            completedLessonId =
              completedLesson.toString();
          }

          if (
            completedLessonId ===
            lessonId.toString()
          ) {
            isCompleted = true;
            break;
          }
        }

        setCompleted(isCompleted);
      } catch (err) {
        console.error(
          "Enrollment Error:",
          err
        );

        setMessage(
          err.message ||
            "Unable to get enrollment."
        );
      }
    }

    getEnrollment();
  }, [lesson, lessonId, router]);

  // ==========================================
  // MARK LESSON AS COMPLETED
  // ==========================================

  async function markLessonCompleted() {
    if (updating) {
      return;
    }

    if (completed) {
      setMessage(
        "This lesson is already completed."
      );
      return;
    }

    if (!enrollment) {
      setMessage(
        "You are not enrolled in this course."
      );
      return;
    }

    try {
      setUpdating(true);
      setMessage("");

      const url =
        "http://localhost:5000/api/enrollments/" +
        enrollment._id +
        "/lesson/" +
        lessonId +
        "/complete";

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      console.log(
        "Complete Lesson Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark lesson as completed"
        );
      }

      setCompleted(true);

      setProgress(
        Number(data.progress) || 0
      );

      if (data.enrollment) {
        setEnrollment(data.enrollment);
      }

      setMessage(
        "Lesson completed successfully! Your progress is now " +
          data.progress +
          "%."
      );
    } catch (err) {
      console.error(
        "Complete Lesson Error:",
        err
      );

      setMessage(
        err.message ||
          "Unable to update progress."
      );
    } finally {
      setUpdating(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Lesson...</h2>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.errorBox}>
          <h2>Unable to Load Lesson</h2>

          <p>{error}</p>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            style={styles.button}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // LESSON NOT FOUND
  // ==========================================

  if (!lesson) {
    return (
      <div style={styles.center}>
        <h2>Lesson not found.</h2>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div style={styles.container}>

      <header style={styles.header}>

        <h1 style={styles.headerTitle}>
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

      <main style={styles.main}>

        <button
          onClick={() => {
            if (
              lesson.course &&
              lesson.course._id
            ) {
              router.push(
                "/lessons?courseId=" +
                  lesson.course._id
              );
            } else {
              router.push("/lessons");
            }
          }}
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

              <h3 style={styles.courseHeading}>
                Course
              </h3>

              <p style={styles.courseTitle}>
                {lesson.course.title}
              </p>

            </div>
          )}

          <div style={styles.infoBox}>

            <strong>Duration:</strong>

            <span>
              {lesson.duration ||
                "30 Minutes"}
            </span>

          </div>

          <div style={styles.progressContainer}>

            <div style={styles.progressHeader}>

              <strong>
                Course Progress
              </strong>

              <strong>
                {progress}%
              </strong>

            </div>

            <div
              style={
                styles.progressBackground
              }
            >

              <div
                style={{
                  ...styles.progressBar,
                  width: progress + "%"
                }}
              />

            </div>

          </div>

          {/* =====================================
              VIDEO SECTION
          ====================================== */}

          <div style={styles.videoSection}>

            <h3 style={styles.videoTitle}>
              Lesson Video
            </h3>

            {lesson.videoUrl ? (
              <div style={styles.videoWrapper}>

                <video
                  controls
                  width="100%"
                  style={styles.video}
                >
                  <source
                    src={lesson.videoUrl}
                    type="video/mp4"
                  />

                  Your browser does not support
                  the video tag.
                </video>

              </div>
            ) : (
              <div style={styles.noVideo}>

                <div style={styles.playIcon}>
                  ▶
                </div>

                <h3>
                  No Video Available
                </h3>

                <p>
                  No video has been added
                  for this lesson yet.
                </p>

              </div>
            )}

          </div>

          {/* =====================================
              MESSAGE
          ====================================== */}

          {message && (
            <div
              style={
                completed
                  ? styles.successMessage
                  : styles.messageBox
              }
            >
              {message}
            </div>
          )}

          {/* =====================================
              COMPLETE BUTTON
          ====================================== */}

          <button
            onClick={markLessonCompleted}
            disabled={
              completed || updating
            }
            style={{
              ...styles.completeButton,
              backgroundColor:
                completed
                  ? "#6b7280"
                  : "#16a34a",
              cursor:
                completed || updating
                  ? "not-allowed"
                  : "pointer"
            }}
          >
            {updating
              ? "Updating Progress..."
              : completed
              ? "✓ Lesson Completed"
              : "✓ Mark Lesson as Complete"}
          </button>

        </div>

      </main>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

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
    boxShadow:
      "0 3px 12px rgba(0, 0, 0, 0.1)"
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

  courseHeading: {
    marginTop: 0,
    marginBottom: "8px"
  },

  courseTitle: {
    margin: 0,
    color: "#444"
  },

  infoBox: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "25px"
  },

  progressContainer: {
    marginBottom: "25px"
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    color: "#333"
  },

  progressBackground: {
    width: "100%",
    height: "12px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden"
  },

  progressBar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "10px",
    transition: "width 0.4s ease"
  },

  videoSection: {
    marginBottom: "25px"
  },

  videoTitle: {
    fontSize: "22px",
    color: "#222",
    marginBottom: "12px"
  },

  videoWrapper: {
    width: "100%",
    background: "#000",
    borderRadius: "10px",
    overflow: "hidden"
  },

  video: {
    display: "block",
    width: "100%",
    maxHeight: "500px",
    background: "#000"
  },

  noVideo: {
    minHeight: "280px",
    background: "#111827",
    color: "white",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "7px",
    fontSize: "16px",
    fontWeight: "600"
  },

  messageBox: {
    background: "#fef2f2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "600"
  },

  successMessage: {
    background: "#ecfdf5",
    color: "#166534",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "15px",
    textAlign: "center",
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
    boxShadow:
      "0 3px 12px rgba(0, 0, 0, 0.1)"
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};