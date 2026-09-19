"use client";

import { useEffect, useMemo, useState } from "react";

function getInstructorName(course) {
  if (course?.instructorName) {
    return course.instructorName;
  }

  if (course?.displayInstructor) {
    return course.displayInstructor;
  }

  if (typeof course?.instructor === "string") {
    return course.instructor;
  }

  if (
    course?.instructor &&
    typeof course.instructor === "object"
  ) {
    return course.instructor.name || "Unknown Instructor";
  }

  return "Unknown Instructor";
}

function getCourseId(course) {
  return course?._id || course?.id;
}

function getCourseDuration(course) {
  if (typeof course?.duration === "string") {
    return course.duration;
  }

  if (course?.duration) {
    return `${course.duration} Hours`;
  }

  return "Not specified";
}

function getEnrollmentCount(course) {
  if (typeof course?.studentsEnrolled === "number") {
    return course.studentsEnrolled;
  }

  if (typeof course?.enrolled === "number") {
    return course.enrolled;
  }

  if (Array.isArray(course?.enrollments)) {
    return course.enrollments.length;
  }

  return 0;
}

function getCourseImage(course) {
  return (
    course?.image ||
    course?.thumbnail ||
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60"
  );
}

function getCourseLevel(course) {
  return course?.level || "Beginner";
}

function getCourseRating(course) {
  return course?.rating || 0;
}

function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-number">{value}</div>

      <div className="stat-label">{label}</div>
    </div>
  );
}

function CourseCard({ course }) {
  const courseId = getCourseId(course);
  const instructorName = getInstructorName(course);
  const enrollmentCount = getEnrollmentCount(course);

  return (
    <article className="course-card">
      <div className="course-image-wrapper">
        <img
          src={getCourseImage(course)}
          alt={course?.title || "Course image"}
          className="course-image"
        />

        <span className="course-category">
          {course?.category || "General"}
        </span>

        <span
          className={`course-level level-${String(
            getCourseLevel(course)
          ).toLowerCase()}`}
        >
          {getCourseLevel(course)}
        </span>
      </div>

      <div className="course-content">
        <h3 className="course-title">
          {course?.title || "Untitled Course"}
        </h3>

        <p className="course-description">
          {course?.description || "No description available."}
        </p>

        <div className="course-meta">
          <span>🧑‍🏫 {instructorName}</span>

          <span>⏱️ {getCourseDuration(course)}</span>
        </div>

        <div className="course-rating-row">
          <span className="rating-badge">
            ⭐ {getCourseRating(course)}
          </span>

          <span className="enrolled-badge">
            👥 {enrollmentCount} enrolled
          </span>
        </div>

        <div className="course-bottom">
          <div className="course-price">
            ₹
            {Number(course?.price || 0).toLocaleString(
              "en-IN"
            )}
          </div>

          <div className="course-actions">
            <a
              href={`/courses/${courseId}`}
              className="details-button"
            >
              Details
            </a>

            <a
              href={`/enroll/${courseId}`}
              className="enroll-button"
            >
              Enroll
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch(
          "http://localhost:5000/api/courses",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        let courseData = [];

        if (Array.isArray(result)) {
          courseData = result;
        } else if (Array.isArray(result.courses)) {
          courseData = result.courses;
        } else if (Array.isArray(result.data)) {
          courseData = result.data;
        }

        setCourses(courseData);
      } catch (error) {
        console.error("Unable to load courses:", error);

        setErrorMessage(
          "Unable to load courses from the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        courses
          .map((course) => course?.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return courses.filter((course) => {
      const instructorName =
        getInstructorName(course).toLowerCase();

      const title = String(
        course?.title || ""
      ).toLowerCase();

      const description = String(
        course?.description || ""
      ).toLowerCase();

      const category = String(
        course?.category || ""
      ).toLowerCase();

      const matchesSearch =
        title.includes(search) ||
        description.includes(search) ||
        instructorName.includes(search) ||
        category.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        course?.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchText, selectedCategory]);

  const totalEnrollments = courses.reduce(
    (total, course) =>
      total + getEnrollmentCount(course),
    0
  );

  const uniqueInstructors = new Set(
    courses
      .map((course) => {
        if (
          course?.instructor &&
          typeof course.instructor === "object"
        ) {
          return course.instructor._id;
        }

        return getInstructorName(course);
      })
      .filter(Boolean)
  ).size;

  return (
    <main className="page-wrapper">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-inner">
          <a href="/" className="brand-area">
            <div className="mongodb-logo">
              MONGODB
              <br />
              ATLAS
            </div>

            <div className="brand-name">
              EduCourse
            </div>
          </a>

          <nav className="navigation">
            <a
              href="/"
              className="nav-link active"
            >
              Home
            </a>

            <a
              href="/courses"
              className="nav-link"
            >
              All
              <br />
              Courses
            </a>

            <a
              href="/student-dashboard"
              className="nav-link"
            >
              Student
              <br />
              Dashboard
            </a>

            <a
              href="/admin"
              className="nav-link"
            >
              Admin
              <br />
              Portal
            </a>

            <a
              href="/aggregations"
              className="nav-link"
            >
              MongoDB
              <br />
              Aggregations
            </a>
          </nav>

          <a
            href="/login"
            className="login-button"
          >
            Login
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-badge">
          🎓 TAÉ-2 DBMS / AWT Mini Project
        </div>

        <h1 className="hero-title">
          Online Course Management System
        </h1>

        <p className="hero-description">
          A full-stack learning platform built with{" "}
          <strong>Next.js 16</strong>,{" "}
          <strong>Express.js</strong>, and{" "}
          <strong>MongoDB Atlas</strong>,
          <br />
          demonstrating schema design, complete CRUD
          operations, and multi-stage aggregation pipelines.
        </p>

        <div className="hero-buttons">
          <a
            href="/courses"
            className="hero-button primary"
          >
            Explore All Courses →
          </a>

          <a
            href="/admin"
            className="hero-button secondary"
          >
            Manage Courses (CRUD) ⚙️
          </a>
        </div>

        <a
          href="/aggregations"
          className="aggregation-button"
        >
          MongoDB Aggregations 📊
        </a>
      </section>

      {/* STATISTICS */}
      <section className="stats-grid">
        <StatCard
          icon="📚"
          value={courses.length}
          label="Active Courses"
        />

        <StatCard
          icon="🎓"
          value="6"
          label="Registered Students"
        />

        <StatCard
          icon="🧑‍🏫"
          value={uniqueInstructors}
          label="Verified Instructors"
        />

        <StatCard
          icon="📈"
          value={totalEnrollments}
          label="Total Enrollments"
        />
      </section>

      {/* FEATURED COURSES */}
      <section className="courses-section">
        <div className="section-heading">
          <div>
            <h2>
              Featured MongoDB Courses
            </h2>

            <p>
              Live records queried from MongoDB Atlas
              collections
            </p>
          </div>

          <a
            href="/courses"
            className="view-all-link"
          >
            View All ({courses.length}) →
          </a>
        </div>

        <div className="filter-area">
          <input
            type="text"
            className="search-input"
            placeholder="Search courses or instructors..."
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
          />

          <select
            className="category-select"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="loading-message">
            Loading courses from MongoDB Atlas...
          </div>
        )}

        {!loading && errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {!loading &&
          !errorMessage &&
          filteredCourses.length === 0 && (
            <div className="empty-message">
              No courses found.
            </div>
          )}

        {!loading &&
          !errorMessage &&
          filteredCourses.length > 0 && (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={getCourseId(course)}
                  course={course}
                />
              ))}
            </div>
          )}
      </section>

      {/* MONGODB FEATURES */}
      <section className="features-section">
        <h2>
          System Architecture & MongoDB Features
          Implemented
        </h2>

        <div className="features-grid">
          <div className="feature-item">
            <h3>
              1. MongoDB Atlas Connectivity
            </h3>

            <p>
              Mongoose ODM connection to cloud replica
              set with resilient DNS and error trapping.
            </p>
          </div>

          <div className="feature-item">
            <h3>
              2. Complete CRUD APIs
            </h3>

            <p>
              Full REST endpoints including GET, POST,
              PUT and DELETE for modifying real documents
              in MongoDB.
            </p>
          </div>

          <div className="feature-item">
            <h3>
              3. Relational Modeling
            </h3>

            <p>
              Collections with ObjectId references,
              cascade logic, and compound unique indexes.
            </p>
          </div>

          <div className="feature-item">
            <h3>
              4. Aggregation Pipelines
            </h3>

            <p>
              Advanced stages including $group, $match,
              $sort, $lookup, $unwind and $project
              calculations.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          © 2026 EduCourse | Online Course Management
          System
        </p>
      </footer>
    </main>
  );
}