"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";

export default function CourseDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Check logged in student
    const stored = localStorage.getItem("studentUser");
    if (stored) {
      try {
        setStudent(JSON.parse(stored));
      } catch (e) {}
    }
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
      if (!res.ok) throw new Error("Course not found or server error");
      const data = await res.json();
      if (data.success && data.course) {
        setCourse(data.course);
        setLessons(data.lessons || []);
      } else {
        // Direct object fallback
        setCourse(data);
      }
    } catch (err) {
      console.error("Course details fetch error:", err);
      setError("Failed to load course details from MongoDB Atlas.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setSuccessMsg("");
    setError("");

    let studentId = student?._id;

    // If no student logged in, prompt or auto-select demo student
    if (!studentId) {
      try {
        // Fetch first student from database for seamless demo experience
        const studentsRes = await fetch("http://localhost:5000/api/students");
        const studentsData = await studentsRes.json();
        if (studentsData.students && studentsData.students.length > 0) {
          studentId = studentsData.students[0]._id;
          // Set as active session
          localStorage.setItem("studentUser", JSON.stringify(studentsData.students[0]));
          setStudent(studentsData.students[0]);
        } else {
          setError("Please login or register first to enroll in courses.");
          return;
        }
      } catch (e) {
        setError("Please login to enroll in this course.");
        return;
      }
    }

    setEnrolling(true);
    try {
      const res = await fetch("http://localhost:5000/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          courseId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Enrollment failed. Duplicate enrollment prevention may be active.");
      } else {
        setSuccessMsg(data.message || "Successfully enrolled in course!");
        // Refresh course to see updated enrollment count
        fetchCourseDetails();
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      setError("Network error during enrollment. Ensure backend is running.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Loading message="Loading course curriculum from MongoDB..." />;
  if (error && !course) return <div className="page-container"><ErrorMessage message={error} /></div>;
  if (!course) return <div className="page-container"><p>Course not found.</p></div>;

  const instructorName =
    course.instructor && typeof course.instructor === "object"
      ? course.instructor.name
      : course.instructorName || "Senior Instructor";

  const instructorSpecialization =
    course.instructor && typeof course.instructor === "object"
      ? course.instructor.specialization
      : "Software Engineering & Computer Science";

  return (
    <div className="page-container">
      {/* Course Header Banner */}
      <div className="course-detail-header">
        <div className="detail-meta-tags">
          <span className="card-category-badge">{course.category}</span>
          <span className={`card-level-badge level-${(course.level || "Beginner").toLowerCase()}`}>
            {course.level || "Beginner"} Level
          </span>
          <span className="rating-pill">⭐ {course.rating ? Number(course.rating).toFixed(1) : "4.5"} Rating</span>
        </div>

        <h1 className="detail-title">{course.title}</h1>
        <p className="detail-desc">{course.description}</p>

        <div className="detail-instructor-strip">
          <div className="instructor-avatar">👨‍🏫</div>
          <div>
            <div className="inst-name">{instructorName}</div>
            <div className="inst-spec">{instructorSpecialization}</div>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
      {successMsg && <ErrorMessage message={successMsg} type="success" onDismiss={() => setSuccessMsg("")} />}

      {/* Main Grid */}
      <div className="detail-layout">
        {/* Left Column: Syllabus & Lessons */}
        <div className="detail-main">
          <div className="content-box">
            <h2>Course Curriculum ({lessons.length} Lessons)</h2>
            <p className="box-sub">Structured modules stored in MongoDB <code>lessons</code> collection</p>

            {lessons.length === 0 ? (
              <div className="empty-box">
                <p>Curriculum lessons are being updated for this course.</p>
              </div>
            ) : (
              <div className="lessons-list">
                {lessons.map((lesson, idx) => (
                  <div key={lesson._id || idx} className="lesson-item">
                    <div className="lesson-left">
                      <span className="lesson-num">{lesson.lessonNumber || idx + 1}</span>
                      <div>
                        <h4 className="lesson-title">{lesson.title}</h4>
                        <span className="lesson-dur">⏱️ {lesson.duration || "15 mins"}</span>
                      </div>
                    </div>
                    <span className="lesson-status">Available</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="content-box" style={{ marginTop: "24px" }}>
            <h2>About the Instructor</h2>
            <p>
              <strong>{instructorName}</strong> is an experienced educator specializing in {instructorSpecialization}.
              All course assignments, practical lab tasks, and quizzes are verified and structured to modern industry standards.
            </p>
          </div>
        </div>

        {/* Right Column: Enrollment Card */}
        <div className="detail-sidebar">
          <div className="pricing-card">
            <img
              src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60"}
              alt={course.title}
              className="pricing-img"
            />
            <div className="pricing-body">
              <div className="price-huge">
                <span className="curr">₹</span>
                <span className="val">{course.price}</span>
              </div>
              <p className="guarantee">Full lifetime access & certificate included</p>

              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn-enroll-huge"
              >
                {enrolling ? "Enrolling..." : "Enroll in this Course Now"}
              </button>

              <div className="course-features-list">
                <div className="feat-item">⏱️ Duration: <strong>{course.duration}</strong></div>
                <div className="feat-item">👥 Enrolled: <strong>{course.studentsEnrolled || 0} students</strong></div>
                <div className="feat-item">📊 Level: <strong>{course.level || "Beginner"}</strong></div>
                <div className="feat-item">📱 Access: Mobile & Desktop</div>
                <div className="feat-item">📜 Certificate of Completion</div>
              </div>

              {student && (
                <div className="logged-info">
                  Enrolling as: <strong>{student.name}</strong> ({student.email})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
