"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState("");

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (!savedStudent) {
      router.push("/login");
      return;
    }

    try {
      const studentData = JSON.parse(savedStudent);

      setStudent(studentData);
      loadEnrollments(studentData);
    } catch (error) {
      console.error("Invalid student data:", error);

      localStorage.removeItem("student");
      router.push("/login");
    }
  }, [router]);

  const loadEnrollments = async (studentData) => {
    try {
      setLoadingCourses(true);
      setCourseError("");

      const studentId =
        studentData.id || studentData._id;

      if (!studentId) {
        setCourseError("Student ID is missing.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/enrollments/student/${studentId}`
      );

      const data = await response.json();

      console.log("Enrollment API response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load courses"
        );
      }

      setEnrollments(data.enrollments || []);
    } catch (error) {
      console.error(
        "Enrollment loading error:",
        error
      );

      setCourseError(
        error.message ||
          "Unable to load enrolled courses."
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/login");
  };

  const openLessons = (courseId) => {
    if (!courseId) {
      alert("Course ID is missing.");
      return;
    }

    router.push(
      `/lessons?courseId=${courseId}`
    );
  };

  if (!student) {
    return (
      <div style={styles.center}>
        <h2>Loading Dashboard...</h2>
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
          onClick={handleLogout}
          style={styles.headerButton}
        >
          Logout
        </button>

      </header>


      {/* MAIN CONTENT */}

      <main style={styles.main}>

        <h2>
          Student Dashboard
        </h2>

        <p>
          Welcome, {student.name}!
        </p>


        {/* STUDENT INFORMATION */}

        <div style={styles.infoCard}>

          <h3>
            Student Information
          </h3>

          <p>
            <strong>Student ID:</strong>{" "}
            {student.studentId}
          </p>

          <p>
            <strong>Name:</strong>{" "}
            {student.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {student.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {student.phone || "Not provided"}
          </p>

        </div>


        {/* OPTIONS */}

        <div style={styles.optionsGrid}>

          {/* COURSES */}

          <div
            onClick={() =>
              router.push("/courses")
            }
            style={styles.card}
          >

            <h3>
              Courses
            </h3>

            <p>
              View available courses
            </p>

          </div>


          {/* MY ENROLLMENTS */}

          <div
            onClick={() =>
              router.push("/enrollments")
            }
            style={styles.card}
          >

            <h3>
              My Enrollments
            </h3>

            <p>
              View enrolled courses
            </p>

          </div>


          {/* PROGRESS */}

          <div
            onClick={() =>
              router.push("/analytics")
            }
            style={styles.card}
          >

            <h3>
              Progress
            </h3>

            <p>
              View learning progress
            </p>

          </div>

        </div>


        {/* COURSE LESSONS */}

        <section style={styles.lessonsSection}>

          <h2>
            Course Lessons
          </h2>

          <p style={styles.subtitle}>
            Continue learning from your
            enrolled courses.
          </p>


          {/* LOADING */}

          {loadingCourses && (

            <div style={styles.messageCard}>

              <h3>
                Loading Course Lessons...
              </h3>

              <p>
                Please wait.
              </p>

            </div>

          )}


          {/* ERROR */}

          {!loadingCourses &&
            courseError && (

              <div style={styles.error}>

                <h3>
                  Unable to Load Courses
                </h3>

                <p>
                  {courseError}
                </p>

              </div>

          )}


          {/* NO COURSES */}

          {!loadingCourses &&
            !courseError &&
            enrollments.length === 0 && (

              <div style={styles.messageCard}>

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

          )}


          {/* ENROLLED COURSES */}

          {!loadingCourses &&
            !courseError &&
            enrollments.length > 0 && (

              <div style={styles.courseGrid}>

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
                        key={
                          enrollment._id
                        }
                        style={styles.courseCard}
                      >

                        <h3>
                          {course?.title ||
                            "Course"}
                        </h3>

                        <p style={styles.description}>
                          {course?.description ||
                            "Continue learning this course."}
                        </p>


                        {/* PROGRESS */}

                        <div
                          style={{
                            marginTop: "20px"
                          }}
                        >

                          <div
                            style={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              marginBottom: "7px"
                            }}
                          >

                            <span>
                              Progress
                            </span>

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
                                width:
                                  `${progress}%`
                              }}
                            />

                          </div>

                        </div>


                        {/* VIEW LESSONS */}

                        <button
                          onClick={() =>
                            openLessons(
                              courseId
                            )
                          }
                          style={
                            styles.lessonButton
                          }
                        >
                          📚 View Course Lessons
                        </button>

                      </div>

                    );
                  }
                )}

              </div>

          )}

        </section>

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

  infoCard: {
    background: "white",
    padding: "25px",
    marginTop: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)"
  },

  optionsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "30px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)",
    cursor: "pointer"
  },

  lessonsSection: {
    marginTop: "40px"
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px"
  },

  messageCard: {
    background: "white",
    padding: "35px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)"
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "20px",
    borderRadius: "10px"
  },

  courseGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "20px"
  },

  courseCard: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.1)"
  },

  description: {
    color: "#666",
    lineHeight: "1.5"
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
    marginTop: "20px",
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
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

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};