"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================
     FETCH COURSES
  ========================= */

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

      console.log(
        "Courses API Response:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load courses"
        );
      }


      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses(
          data.courses || []
        );
      }

    } catch (error) {

      console.error(
        "Courses Error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================
     VIEW COURSE
  ========================= */

  const handleViewCourse = (course) => {

    const courseId =
      course._id || course.id;


    if (!courseId) {
      alert("Course ID not found.");
      return;
    }


    router.push(
      `/courses/${courseId}`
    );
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <div style={styles.center}>

        <h2>
          Loading Courses...
        </h2>

      </div>
    );

  }


  return (

    <div style={styles.container}>

      {/* =========================
          HEADER
      ========================= */}

      <header style={styles.header}>

        <h1>
          Online Course Management System
        </h1>


        <div style={styles.headerButtons}>

          {/* DASHBOARD */}

          <button
            onClick={() =>
              router.push("/dashboard")
            }

            style={styles.headerButton}
          >
            Dashboard
          </button>


          {/* MY ENROLLMENTS */}

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


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main style={styles.main}>

        <h2 style={styles.heading}>
          Available Courses
        </h2>


        <p style={styles.subtitle}>
          Browse our available courses and
          start learning today.
        </p>


        {/* ERROR */}

        {error && (

          <div style={styles.error}>

            <strong>
              Error:
            </strong>{" "}

            {error}

            <br />

            <button
              onClick={fetchCourses}
              style={styles.retryButton}
            >
              Try Again
            </button>

          </div>

        )}


        {/* NO COURSES */}

        {!error &&
          courses.length === 0 && (

            <div style={styles.empty}>

              <h3>
                No Courses Available
              </h3>


              <p>
                There are currently no courses
                available.
              </p>

            </div>

          )}


        {/* =========================
            COURSE GRID
        ========================= */}

        <div style={styles.grid}>

          {courses.map((course) => (

            <div
              key={
                course._id ||
                course.id
              }

              style={styles.card}
            >

              {/* COURSE TITLE */}

              <h3
                style={
                  styles.courseTitle
                }
              >
                {course.title ||
                  course.name ||
                  "Untitled Course"}
              </h3>


              {/* DESCRIPTION */}

              <p
                style={
                  styles.description
                }
              >
                {course.description ||
                  "No description available."}
              </p>


              {/* COURSE INFORMATION */}

              <div style={styles.info}>

                {/* CATEGORY */}

                <p>

                  <strong>
                    Category:
                  </strong>{" "}

                  {course.category ||
                    "Not specified"}

                </p>


                {/* DURATION */}

                <p>

                  <strong>
                    Duration:
                  </strong>{" "}

                  {course.duration ||
                    "Not specified"}

                </p>


                {/* INSTRUCTOR */}

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


              {/* VIEW COURSE BUTTON */}

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


/* =========================
   STYLES
========================= */

const styles = {


  /* =========================
     PAGE CONTAINER
  ========================= */

  container: {

    minHeight: "100vh",

    background:
      "linear-gradient(rgba(10, 20, 40, 0.55), rgba(10, 20, 40, 0.55)), url('https://plus.unsplash.com/premium_photo-1661670152522-8db946b83f81?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8')",

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundAttachment: "fixed",

    backgroundRepeat: "no-repeat"

  },


  /* =========================
     HEADER
  ========================= */

  header: {

    background: "#2563eb",

    color: "white",

    padding: "18px 30px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center"

  },


  /* =========================
     HEADER BUTTONS
  ========================= */

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


  /* =========================
     MAIN
  ========================= */

  main: {

    maxWidth: "1100px",

    margin: "40px auto",

    padding: "20px"

  },


  /* =========================
     HEADING
  ========================= */

  heading: {

    fontSize: "32px",

    color: "white",

    marginBottom: "8px"

  },


  /* =========================
     SUBTITLE
  ========================= */

  subtitle: {

    color: "#f1f5f9",

    fontSize: "17px",

    marginBottom: "30px"

  },


  /* =========================
     COURSE GRID
  ========================= */

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(2, 1fr)",

    gap: "25px"

  },


  /* =========================
     COURSE CARD
  ========================= */

  card: {

    background: "white",

    padding: "25px",

    borderRadius: "10px",

    boxShadow:
      "0 3px 12px rgba(0,0,0,0.1)"

  },


  /* =========================
     COURSE TITLE
  ========================= */

  courseTitle: {

    fontSize: "22px",

    color: "#2563eb",

    marginBottom: "15px"

  },


  /* =========================
     DESCRIPTION
  ========================= */

  description: {

    color: "#555",

    lineHeight: "1.5",

    marginBottom: "20px"

  },


  /* =========================
     COURSE INFORMATION
  ========================= */

  info: {

    color: "#444",

    lineHeight: "1.7",

    marginBottom: "20px"

  },


  /* =========================
     VIEW BUTTON
  ========================= */

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


  /* =========================
     ERROR
  ========================= */

  error: {

    background: "#fee2e2",

    color: "#991b1b",

    padding: "15px",

    borderRadius: "8px",

    marginBottom: "25px"

  },


  /* =========================
     RETRY BUTTON
  ========================= */

  retryButton: {

    marginTop: "10px",

    background: "#2563eb",

    color: "white",

    border: "none",

    padding: "8px 15px",

    borderRadius: "5px",

    cursor: "pointer"

  },


  /* =========================
     EMPTY COURSES
  ========================= */

  empty: {

    background: "white",

    padding: "40px",

    borderRadius: "10px",

    textAlign: "center"

  },


  /* =========================
     LOADING
  ========================= */

  center: {

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background:
      "linear-gradient(rgba(10, 20, 40, 0.55), rgba(10, 20, 40, 0.55)), url('https://plus.unsplash.com/premium_photo-1661670152522-8db946b83f81?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8')",

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundAttachment: "fixed",

    backgroundRepeat: "no-repeat",

    color: "white"

  }

};