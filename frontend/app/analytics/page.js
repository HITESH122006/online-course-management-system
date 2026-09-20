"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudentProgress();
  }, []);

  const loadStudentProgress = async () => {
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

      setStudent(studentData);

      const studentId =
        studentData.id ||
        studentData._id;

      if (!studentId) {
        setError("Student ID is missing.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/enrollments/student/${studentId}`
      );

      const data = await response.json();

      console.log(
        "Progress API response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load progress"
        );
      }

      setEnrollments(
        data.enrollments || []
      );
    } catch (error) {
      console.error(
        "Progress Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load progress."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalCourses =
    enrollments.length;

  const completedCourses =
    enrollments.filter(
      (enrollment) =>
        enrollment.status === "Completed" ||
        enrollment.progress === 100
    ).length;

  const activeCourses =
    enrollments.filter(
      (enrollment) =>
        enrollment.status !== "Completed" &&
        enrollment.progress < 100
    ).length;

  const overallProgress =
    totalCourses > 0
      ? Math.round(
          enrollments.reduce(
            (total, enrollment) =>
              total +
              (enrollment.progress || 0),
            0
          ) / totalCourses
        )
      : 0;

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>
          Loading Progress...
        </h2>
      </div>
    );
  }

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

        <button
          onClick={() =>
            router.push("/dashboard")
          }
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>


        <h2 style={styles.title}>
          Learning Progress
        </h2>

        {student && (
          <p style={styles.welcome}>
            Student:{" "}
            <strong>
              {student.name}
            </strong>
          </p>
        )}


        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            <h3>
              Unable to Load Progress
            </h3>

            <p>
              {error}
            </p>
          </div>
        )}


        {/* SUMMARY */}

        {!error && (
          <>
            <div style={styles.summaryGrid}>

              {/* TOTAL COURSES */}

              <div style={styles.summaryCard}>

                <h3>
                  Total Courses
                </h3>

                <p style={styles.number}>
                  {totalCourses}
                </p>

              </div>


              {/* COMPLETED */}

              <div style={styles.summaryCard}>

                <h3>
                  Completed Courses
                </h3>

                <p style={styles.number}>
                  {completedCourses}
                </p>

              </div>


              {/* ACTIVE */}

              <div style={styles.summaryCard}>

                <h3>
                  Active Courses
                </h3>

                <p style={styles.number}>
                  {activeCourses}
                </p>

              </div>


              {/* OVERALL */}

              <div style={styles.summaryCard}>

                <h3>
                  Overall Progress
                </h3>

                <p style={styles.number}>
                  {overallProgress}%
                </p>

              </div>

            </div>


            {/* COURSE PROGRESS */}

            <section
              style={{
                marginTop: "35px"
              }}
            >

              <h2>
                Course Progress
              </h2>

              <p style={styles.subtitle}>
                Track your learning progress
                for each enrolled course.
              </p>


              {enrollments.length === 0 ? (

                <div style={styles.empty}>

                  <h3>
                    No Courses Enrolled
                  </h3>

                  <p>
                    You have not enrolled
                    in any course yet.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/courses")
                    }
                    style={styles.primaryButton}
                  >
                    Browse Courses
                  </button>

                </div>

              ) : (

                <div style={styles.courseList}>

                  {enrollments.map(
                    (enrollment) => {

                      const course =
                        enrollment.course;

                      const progress =
                        enrollment.progress ||
                        0;

                      return (
                        <div
                          key={
                            enrollment._id
                          }
                          style={styles.courseCard}
                        >

                          <div
                            style={
                              styles.courseHeader
                            }
                          >

                            <div>

                              <h3>
                                {course?.title ||
                                  "Course"}
                              </h3>

                              <p
                                style={
                                  styles.description
                                }
                              >
                                {course?.description ||
                                  "Continue learning this course."}
                              </p>

                            </div>

                            <strong>
                              {progress}%
                            </strong>

                          </div>


                          {/* PROGRESS BAR */}

                          <div
                            style={
                              styles.progressBackground
                            }
                          >

                            <div
                              style={{
                                ...styles.progressBar,
                                width:
                                  `${progress}%`
                              }}
                            />

                          </div>


                          <div
                            style={
                              styles.progressInfo
                            }
                          >

                            <span>
                              {progress === 100
                                ? "Completed"
                                : "In Progress"}
                            </span>

                            <span>
                              {progress}%
                            </span>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </section>

          </>
        )}

      </main>

    </div>
  );
}


/* ============================= */
/* STYLES */
/* ============================= */

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

  title: {
    fontSize: "32px",
    color: "#222",
    marginBottom: "8px"
  },

  welcome: {
    color: "#555",
    marginBottom: "30px"
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px"
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "20px",
    marginTop: "25px"
  },

  summaryCard: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  number: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#2563eb",
    marginTop: "10px"
  },

  courseList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  courseCard: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)"
  },

  courseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px"
  },

  description: {
    color: "#666",
    lineHeight: "1.5",
    marginTop: "8px"
  },

  progressBackground: {
    width: "100%",
    height: "12px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "20px"
  },

  progressBar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "10px"
  },

  progressInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    color: "#555",
    fontSize: "14px"
  },

  empty: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)"
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
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "20px",
    borderRadius: "10px"
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};