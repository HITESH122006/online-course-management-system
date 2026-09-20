"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:5000/api/courses";

function getInstructorName(instructor) {
  if (!instructor) return "Instructor";
  if (typeof instructor === "string") return instructor;
  return instructor.name || "Instructor";
}

function getCourseId(course) {
  return course._id || course.id;
}

function CourseCard({ course }) {
  const instructorName = getInstructorName(course.instructor);
  const courseId = getCourseId(course);

  return (
    <div className="course-card">
      <div className="course-image">
        {course.image ? (
          <img src={course.image} alt={course.title} />
        ) : (
          <div className="image-placeholder">Course</div>
        )}
      </div>

      <div className="course-content">
        <div className="course-top">
          <span className="category">
            {course.category || "Course"}
          </span>

          {course.level && (
            <span className="level">{course.level}</span>
          )}
        </div>

        <h3>{course.title}</h3>

        <p className="description">
          {course.description ||
            "Learn this course with practical lessons."}
        </p>

        <p className="instructor">
          Instructor: <strong>{instructorName}</strong>
        </p>

        <div className="course-info">
          <span>⭐ {course.rating || "4.5"}</span>
          <span>⏱ {course.duration || "8 weeks"}</span>
          <span>👥 {course.studentsEnrolled || 0}</span>
        </div>

        <div className="course-bottom">
          <span className="price">
            {course.price === 0 || course.price === "0"
              ? "Free"
              : `₹${course.price}`}
          </span>

          {/* VIEW COURSE BUTTON */}
          <Link
            href={`/courses/${courseId}`}
            className="details-button"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load courses");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCourses(data);
        } else if (Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else if (Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the course server.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const categories = [
    "All",
    ...new Set(
      courses
        .map((course) => course.category)
        .filter(Boolean)
    ),
  ];

  const filteredCourses = courses.filter((course) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      course.title
        ?.toLowerCase()
        .includes(searchText) ||
      course.description
        ?.toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "All" ||
      course.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      {/* HEADER */}
      <header className="header">
        <div className="header-container">

          <div className="logo">
            Online Course Management
          </div>

          <div className="header-actions">

            {/* LOGIN */}
            <Link
              href="/login"
              className="login-button"
            >
              Login
            </Link>

            {/* REGISTER */}
            <Link
              href="/register"
              className="register-button"
            >
              Register
            </Link>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">

            <span className="hero-label">
              ONLINE LEARNING PLATFORM
            </span>

            <h1>
              Learn New Skills.
              <br />
              Build Your Future.
            </h1>

            <p>
              Explore quality courses, learn from experienced
              instructors, and improve your skills.
            </p>

            <button
              className="hero-button"
              onClick={() =>
                document
                  .getElementById("courses")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Courses
            </button>

          </div>
        </div>
      </section>

      {/* COURSES */}
      <section
        className="courses-section"
        id="courses"
      >
        <div className="section-container">

          <div className="section-heading">
            <div>
              <span className="section-label">
                OUR COURSES
              </span>

              <h2>Popular Courses</h2>
            </div>

            <p>
              Choose a course and start learning today.
            </p>
          </div>

          {/* SEARCH AND FILTER */}
          <div className="filters">

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="message">
              Loading courses...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          {/* NO COURSES */}
          {!loading &&
            !error &&
            filteredCourses.length === 0 && (
              <div className="message">
                No courses found.
              </div>
            )}

          {/* COURSE LIST */}
          {!loading &&
            !error &&
            filteredCourses.length > 0 && (
              <div className="course-grid">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={getCourseId(course)}
                    course={course}
                  />
                ))}
              </div>
            )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <p>
            © 2026 Online Course Management System
          </p>
        </div>
      </footer>
    </main>
  );
}