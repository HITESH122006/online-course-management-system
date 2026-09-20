"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LessonsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");

  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing.");
      setLoading(false);
      return;
    }

    loadLessons();
  }, [courseId]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/lessons/course/${courseId}`
      );

      const data = await response.json();

      console.log("Lessons API response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load lessons"
        );
      }

      setLessons(data.lessons || []);

      if (
        data.lessons &&
        data.lessons.length > 0
      ) {
        setCourse(data.lessons[0].course);
      }
    } catch (error) {
      console.error(
        "Lessons loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load lessons."
      );
    } finally {
      setLoading(false);
    }
  };

  const openLesson = (lessonId) => {
    if (!lessonId) {
      alert("Lesson ID is missing.");
      return;
    }

    router.push(`/lessons/${lessonId}`);
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}

      <header style={styles.header}>

        <h1>
          Online Course Management System
        </h1>

        <button
          onClick={() =>
            router.push("/dashboard")
          }
          style={styles.headerButton}
        >
          Dashboard
        </button>

      </header>


      {/* MAIN CONTENT */}

      <main style={styles.main}>

        {/* BACK BUTTON */}

        <button
          onClick={() =>
            router.push("/dashboard")
          }
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>


        {/* PAGE TITLE */}

        <h2 style={styles.pageTitle}>
          Course Lessons
        </h2>


        {/* LOADING */}

        {loading && (
          <div style={styles.messageCard}>

            <h3>
              Loading Lessons...
            </h3>

            <p>
              Please wait while the
              course lessons are loading.
            </p>

          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div style={styles.error}>

            <h3>
              Unable to Load Lessons
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                router.push("/dashboard")
              }
              style={styles.primaryButton}
            >
              Back to Dashboard
            </button>

          </div>
        )}


        {/* COURSE INFORMATION */}

        {!loading && !error && (
          <>

            <div style={styles.courseHeader}>

              <h2 style={styles.courseTitle}>
                {course?.title ||
                  "Course Lessons"}
              </h2>

              <p style={styles.courseDescription}>
                {course?.description ||
                  "Learn the course step by step."}
              </p>

            </div>


            {/* NO LESSONS */}

            {lessons.length === 0 && (
              <div style={styles.messageCard}>

                <h3>
                  No Lessons Available
                </h3>

                <p>
                  Lessons have not been
                  added for this course yet.
                </p>

              </div>
            )}


            {/* LESSON LIST */}

            {lessons.length > 0 && (
              <div style={styles.lessonList}>

                {lessons.map((lesson) => (

                  <div
                    key={lesson._id}
                    style={styles.lessonCard}
                  >

                    {/* LESSON NUMBER */}

                    <div style={styles.number}>
                      {lesson.lessonNumber}
                    </div>


                    {/* LESSON CONTENT */}

                    <div
                      style={
                        styles.lessonContent
                      }
                    >

                      <h3
                        style={
                          styles.lessonTitle
                        }
                      >
                        {lesson.title}
                      </h3>

                      <p
                        style={
                          styles.lessonDescription
                        }
                      >
                        {lesson.description}
                      </p>

                      <p
                        style={
                          styles.duration
                        }
                      >
                        <strong>
                          Duration:
                        </strong>{" "}
                        {lesson.duration}
                      </p>


                      {/* OPEN LESSON BUTTON */}

                      <button
                        onClick={() =>
                          openLesson(
                            lesson._id
                          )
                        }
                        style={
                          styles.lessonButton
                        }
                      >
                        Open Lesson
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </>
        )}

      </main>

    </div>
  );
}


/* ========================= */
/* STYLES */
/* ========================= */

const styles = {

  container: {
    minHeight: "100vh",
    background: "#f4f7fb"
  },

  header: {
    background: "#2563eb",
    color: "white",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  headerButton: {
    background: "white",
    color: "#2563eb",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  main: {
    maxWidth: "1000px",
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

  pageTitle: {
    marginBottom: "25px"
  },

  courseHeader: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    marginBottom: "25px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)"
  },

  courseTitle: {
    marginBottom: "10px"
  },

  courseDescription: {
    color: "#666",
    lineHeight: "1.6"
  },

  lessonList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  lessonCard: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "flex-start",
    gap: "20px"
  },

  number: {
    minWidth: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px"
  },

  lessonContent: {
    flex: 1
  },

  lessonTitle: {
    marginTop: "0",
    marginBottom: "10px"
  },

  lessonDescription: {
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "10px"
  },

  duration: {
    color: "#777",
    fontSize: "14px",
    marginBottom: "15px"
  },

  lessonButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "11px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px"
  },

  messageCard: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)"
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "25px",
    borderRadius: "10px"
  },

  primaryButton: {
    marginTop: "20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};