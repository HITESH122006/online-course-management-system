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

      const studentId = studentData.id || studentData._id;

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
      console.error("Enrollment loading error:", error);

      setCourseError(
        error.message || "Unable to load enrolled courses."
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

    router.push(`/lessons?courseId=${courseId}`);
  };

  if (!student) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <h2>Loading Dashboard...</h2>
          <p>Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <header style={styles.header}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>🎓</div>

          <div>
            <h1 style={styles.headerTitle}>
              Online Course
            </h1>

            <p style={styles.headerSubtitle}>
              Management System
            </p>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.welcomeMini}>
            <span style={styles.onlineDot}></span>

            <span>
              Hi, {student.name}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </header>


      {/* ================= MAIN ================= */}

      <main style={styles.main}>

        {/* ================= WELCOME ================= */}

        <section style={styles.hero}>
          <div>
            <p style={styles.smallLabel}>
              STUDENT DASHBOARD
            </p>

            <h2 style={styles.heroTitle}>
              Welcome back,{" "}
              <span>{student.name}</span> 👋
            </h2>

            <p style={styles.heroText}>
              Continue your learning journey and
              explore your enrolled courses.
            </p>
          </div>

          <div style={styles.heroIcon}>
            🎓
          </div>
        </section>


        {/* ================= STUDENT INFORMATION ================= */}

        <section style={styles.infoCard}>
          <div style={styles.sectionHeading}>
            <div style={styles.headingIcon}>
              👤
            </div>

            <div>
              <h3 style={styles.sectionTitle}>
                Student Information
              </h3>

              <p style={styles.sectionDescription}>
                Your registered account details
              </p>
            </div>
          </div>

          <div style={styles.infoGrid}>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>
                🆔
              </span>

              <div>
                <span style={styles.infoLabel}>
                  Student ID
                </span>

                <strong style={styles.infoValue}>
                  {student.studentId}
                </strong>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>
                👤
              </span>

              <div>
                <span style={styles.infoLabel}>
                  Full Name
                </span>

                <strong style={styles.infoValue}>
                  {student.name}
                </strong>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>
                ✉️
              </span>

              <div>
                <span style={styles.infoLabel}>
                  Email
                </span>

                <strong style={styles.infoValue}>
                  {student.email}
                </strong>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>
                📱
              </span>

              <div>
                <span style={styles.infoLabel}>
                  Phone
                </span>

                <strong style={styles.infoValue}>
                  {student.phone || "Not provided"}
                </strong>
              </div>
            </div>

          </div>
        </section>


        {/* ================= QUICK OPTIONS ================= */}

        <section style={styles.optionsSection}>
          <div style={styles.sectionTop}>
            <p style={styles.smallLabel}>
              QUICK ACCESS
            </p>

            <h2 style={styles.sectionMainTitle}>
              What would you like to do?
            </h2>
          </div>

          <div style={styles.optionsGrid}>

            {/* COURSES */}

            <div
              onClick={() => router.push("/courses")}
              style={{
                ...styles.optionCard,
                borderTop: "4px solid #2563eb"
              }}
            >
              <div
                style={{
                  ...styles.optionIcon,
                  background: "#dbeafe"
                }}
              >
                📚
              </div>

              <h3 style={styles.optionTitle}>
                Courses
              </h3>

              <p style={styles.optionText}>
                Explore available courses and
                start learning new skills.
              </p>

              <div style={styles.optionLink}>
                Explore Courses →
              </div>
            </div>


            {/* MY ENROLLMENTS */}

            <div
              onClick={() => router.push("/enrollments")}
              style={{
                ...styles.optionCard,
                borderTop: "4px solid #7c3aed"
              }}
            >
              <div
                style={{
                  ...styles.optionIcon,
                  background: "#ede9fe"
                }}
              >
                📝
              </div>

              <h3 style={styles.optionTitle}>
                My Enrollments
              </h3>

              <p style={styles.optionText}>
                View the courses you have
                enrolled in.
              </p>

              <div style={styles.optionLink}>
                View Enrollments →
              </div>
            </div>


            {/* PROGRESS */}

            <div
              onClick={() => router.push("/analytics")}
              style={{
                ...styles.optionCard,
                borderTop: "4px solid #16a34a"
              }}
            >
              <div
                style={{
                  ...styles.optionIcon,
                  background: "#dcfce7"
                }}
              >
                📊
              </div>

              <h3 style={styles.optionTitle}>
                Progress
              </h3>

              <p style={styles.optionText}>
                Track your learning progress and
                course completion.
              </p>

              <div style={styles.optionLink}>
                View Progress →
              </div>
            </div>

          </div>
        </section>


        {/* ================= COURSE LESSONS ================= */}

        <section style={styles.lessonsSection}>

          <div style={styles.lessonsHeader}>
            <div>
              <p style={styles.smallLabel}>
                MY LEARNING
              </p>

              <h2 style={styles.sectionMainTitle}>
                Course Lessons
              </h2>

              <p style={styles.subtitle}>
                Continue learning from your
                enrolled courses.
              </p>
            </div>

            <div style={styles.bookIcon}>
              📖
            </div>
          </div>


          {/* LOADING */}

          {loadingCourses && (
            <div style={styles.messageCard}>
              <div style={styles.spinner}></div>

              <h3>
                Loading Course Lessons...
              </h3>

              <p>
                Please wait while we load
                your courses.
              </p>
            </div>
          )}


          {/* ERROR */}

          {!loadingCourses && courseError && (
            <div style={styles.error}>
              <div style={styles.errorIcon}>
                ⚠️
              </div>

              <div>
                <h3>
                  Unable to Load Courses
                </h3>

                <p>{courseError}</p>
              </div>
            </div>
          )}


          {/* NO COURSES */}

          {!loadingCourses &&
            !courseError &&
            enrollments.length === 0 && (
              <div style={styles.emptyCard}>
                <div style={styles.emptyIcon}>
                  📚
                </div>

                <h3>
                  No Courses Enrolled
                </h3>

                <p>
                  You have not enrolled in
                  any course yet.
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

                {enrollments.map((enrollment) => {

                  const course =
                    enrollment.course;

                  const courseId =
                    course?._id || course?.id;

                  const progress =
                    enrollment.progress || 0;

                  return (
                    <div
                      key={enrollment._id}
                      style={styles.courseCard}
                    >

                      {/* COURSE TOP */}

                      <div style={styles.courseTop}>
                        <div style={styles.courseIcon}>
                          🎓
                        </div>

                        <span
                          style={styles.activeBadge}
                        >
                          {enrollment.status ||
                            "Active"}
                        </span>
                      </div>


                      {/* COURSE TITLE */}

                      <h3 style={styles.courseTitle}>
                        {course?.title || "Course"}
                      </h3>


                      {/* DESCRIPTION */}

                      <p style={styles.description}>
                        {course?.description ||
                          "Continue learning this course."}
                      </p>


                      {/* PROGRESS */}

                      <div
                        style={styles.progressContainer}
                      >
                        <div
                          style={styles.progressHeader}
                        >
                          <span>
                            Learning Progress
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
                              width: `${progress}%`
                            }}
                          />
                        </div>
                      </div>


                      {/* VIEW LESSONS */}

                      <button
                        onClick={() =>
                          openLessons(courseId)
                        }
                        style={styles.lessonButton}
                      >
                        📚

                        <span>
                          View Course Lessons
                        </span>

                        <span>
                          →
                        </span>
                      </button>

                    </div>
                  );
                })}

              </div>
            )}

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer style={styles.footer}>
        <p>
          © 2026 Online Course Management
          System
        </p>

        <p>
          Learn • Grow • Succeed 🚀
        </p>
      </footer>

    </div>
  );
}


/* ================================================= */
/*                       STYLES                       */
/* ================================================= */

const styles = {

  /* ================= FULL BACKGROUND ================= */

  container: {
    minHeight: "100vh",

    background:
      "linear-gradient(rgba(10, 20, 40, 0.55), rgba(10, 20, 40, 0.55)), url('https://plus.unsplash.com/premium_photo-1661670152522-8db946b83f81?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8')",

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",

    color: "#172033"
  },


  /* ================= HEADER ================= */

  header: {
    background:
      "linear-gradient(135deg, #1d4ed8, #2563eb, #4f46e5)",

    color: "white",

    padding: "18px 45px",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    boxShadow:
      "0 4px 20px rgba(37,99,235,0.25)",

    position: "sticky",
    top: 0,
    zIndex: 10
  },

  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },

  logo: {
    width: "48px",
    height: "48px",

    background:
      "rgba(255,255,255,0.18)",

    border:
      "1px solid rgba(255,255,255,0.3)",

    borderRadius: "14px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "25px"
  },

  headerTitle: {
    margin: 0,
    fontSize: "21px",
    fontWeight: "700"
  },

  headerSubtitle: {
    margin: "2px 0 0",
    fontSize: "12px",
    opacity: 0.8
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  welcomeMini: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500"
  },

  onlineDot: {
    width: "9px",
    height: "9px",
    background: "#4ade80",
    borderRadius: "50%",
    boxShadow:
      "0 0 8px rgba(74,222,128,0.8)"
  },

  logoutButton: {
    background:
      "rgba(255,255,255,0.15)",

    color: "white",

    border:
      "1px solid rgba(255,255,255,0.3)",

    padding: "10px 17px",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600",

    display: "flex",
    alignItems: "center",
    gap: "7px"
  },


  /* ================= MAIN ================= */

  main: {
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "35px 25px 60px"
  },


  /* ================= HERO ================= */

  hero: {
    background:
      "linear-gradient(135deg, #172554, #1e40af, #2563eb)",

    borderRadius: "20px",

    padding: "35px 40px",

    color: "white",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    boxShadow:
      "0 15px 35px rgba(30,64,175,0.22)",

    marginBottom: "25px",

    overflow: "hidden",
    position: "relative"
  },

  smallLabel: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    color: "#64748b",
    marginBottom: "7px"
  },

  heroTitle: {
    margin: 0,
    fontSize: "32px",
    lineHeight: "1.2"
  },

  heroText: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#dbeafe",
    fontSize: "15px"
  },

  heroIcon: {
    width: "100px",
    height: "100px",
    borderRadius: "30px",

    background:
      "rgba(255,255,255,0.12)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "50px",

    transform: "rotate(5deg)"
  },


  /* ================= INFORMATION ================= */

  infoCard: {
    background: "white",

    padding: "25px",

    borderRadius: "16px",

    border: "1px solid #e5e7eb",

    boxShadow:
      "0 5px 20px rgba(15,23,42,0.06)",

    marginBottom: "40px"
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "22px"
  },

  headingIcon: {
    width: "45px",
    height: "45px",

    background: "#eff6ff",

    borderRadius: "12px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "21px"
  },

  sectionTitle: {
    margin: 0,
    fontSize: "19px"
  },

  sectionDescription: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "13px"
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px"
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "11px",

    background: "#f8fafc",

    padding: "15px",

    borderRadius: "12px"
  },

  infoIcon: {
    fontSize: "20px"
  },

  infoLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  infoValue: {
    display: "block",
    fontSize: "13px",
    wordBreak: "break-word"
  },


  /* ================= OPTIONS ================= */

  optionsSection: {
    marginBottom: "45px"
  },

  sectionTop: {
    marginBottom: "20px"
  },

  sectionMainTitle: {
    margin: 0,
    fontSize: "25px",
    color: "#172033"
  },

  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px"
  },

  optionCard: {
    background: "white",

    padding: "25px",

    borderRadius: "15px",

    borderLeft: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",

    boxShadow:
      "0 5px 18px rgba(15,23,42,0.06)",

    cursor: "pointer",

    transition:
      "transform 0.2s ease, box-shadow 0.2s ease"
  },

  optionIcon: {
    width: "52px",
    height: "52px",

    borderRadius: "14px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "25px",

    marginBottom: "18px"
  },

  optionTitle: {
    margin: "0 0 8px",
    fontSize: "18px"
  },

  optionText: {
    color: "#b6ccea",
    fontSize: "14px",
    lineHeight: "1.6",
    minHeight: "45px"
  },

  optionLink: {
    marginTop: "18px",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "700"
  },


  /* ================= LESSONS ================= */

  lessonsSection: {
    marginTop: "10px"
  },

  lessonsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  subtitle: {
    color: "#64748b",
    marginTop: "7px",
    fontSize: "14px"
  },

  bookIcon: {
    width: "58px",
    height: "58px",

    background: "#eff6ff",

    borderRadius: "16px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "28px"
  },


  /* ================= COURSE GRID ================= */

  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  },

  courseCard: {
    background: "white",

    padding: "25px",

    borderRadius: "16px",

    border: "1px solid #e5e7eb",

    boxShadow:
      "0 5px 18px rgba(15,23,42,0.06)"
  },

  courseTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },

  courseIcon: {
    width: "48px",
    height: "48px",

    borderRadius: "13px",

    background: "#eff6ff",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "22px"
  },

  activeBadge: {
    background: "#dcfce7",
    color: "#15803d",

    padding: "6px 10px",

    borderRadius: "20px",

    fontSize: "11px",
    fontWeight: "700"
  },

  courseTitle: {
    margin: "0 0 10px",
    fontSize: "18px",
    lineHeight: "1.4"
  },

  description: {
    color: "#64748b",
    lineHeight: "1.6",
    fontSize: "14px",
    minHeight: "45px"
  },


  /* ================= PROGRESS ================= */

  progressContainer: {
    marginTop: "20px",

    padding: "15px",

    background: "#f8fafc",

    borderRadius: "11px"
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",

    marginBottom: "8px",

    fontSize: "13px",
    color: "#475569"
  },

  progressBackground: {
    width: "100%",
    height: "9px",

    background: "#e2e8f0",

    borderRadius: "20px",

    overflow: "hidden"
  },

  progressBar: {
    height: "100%",

    background:
      "linear-gradient(90deg, #2563eb, #4f46e5)",

    borderRadius: "20px",

    transition: "width 0.5s ease"
  },


  /* ================= LESSON BUTTON ================= */

  lessonButton: {
    width: "100%",

    marginTop: "18px",

    background:
      "linear-gradient(135deg, #16a34a, #15803d)",

    color: "white",

    border: "none",

    padding: "13px 16px",

    borderRadius: "9px",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "14px",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    gap: "10px",

    boxShadow:
      "0 5px 12px rgba(22,163,74,0.18)"
  },


  /* ================= MESSAGE ================= */

  messageCard: {
    background: "white",

    padding: "45px",

    borderRadius: "16px",

    textAlign: "center",

    boxShadow:
      "0 5px 18px rgba(15,23,42,0.06)",

    border: "1px solid #e5e7eb"
  },

  emptyCard: {
    background: "white",

    padding: "50px",

    borderRadius: "16px",

    textAlign: "center",

    boxShadow:
      "0 5px 18px rgba(15,23,42,0.06)",

    border: "1px solid #e5e7eb"
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "12px"
  },

  error: {
    background: "#fff1f2",

    color: "#9f1239",

    padding: "20px",

    borderRadius: "13px",

    border: "1px solid #fecdd3",

    display: "flex",

    gap: "15px",

    alignItems: "center"
  },

  errorIcon: {
    fontSize: "28px"
  },

  primaryButton: {
    marginTop: "20px",

    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",

    color: "white",

    border: "none",

    padding: "12px 22px",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "700",

    boxShadow:
      "0 5px 12px rgba(37,99,235,0.2)"
  },


  /* ================= LOADING ================= */

  loadingScreen: {
    minHeight: "100vh",

    background:
      "linear-gradient(rgba(10, 20, 40, 0.55), rgba(10, 20, 40, 0.55)), url('https://plus.unsplash.com/premium_photo-1661670152522-8db946b83f81?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8')",

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",

    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  loadingBox: {
    background: "white",

    padding: "45px",

    borderRadius: "18px",

    textAlign: "center",

    boxShadow:
      "0 10px 30px rgba(15,23,42,0.1)"
  },

  spinner: {
    width: "35px",
    height: "35px",

    border:
      "4px solid #dbeafe",

    borderTop:
      "4px solid #2563eb",

    borderRadius: "50%",

    margin: "0 auto 15px"
  },


  /* ================= FOOTER ================= */

  footer: {
    background: "#172033",

    color: "#cbd5e1",

    padding: "25px 40px",

    display: "flex",
    justifyContent: "space-between",

    fontSize: "13px"
  }
};
