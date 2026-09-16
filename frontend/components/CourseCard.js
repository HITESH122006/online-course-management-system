"use client";

import Link from "next/link";

export default function CourseCard({ course, onEnroll }) {
  const instructor =
    course.instructor && typeof course.instructor === "object"
      ? course.instructor.name
      : course.instructorName || "Senior Instructor";

  return (
    <div className="course-card-v2">
      <div className="card-image-wrap">
        <img
          src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60"}
          alt={course.title}
          className="card-image"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60";
          }}
        />
        <span className="card-category-badge">{course.category}</span>
        <span className={`card-level-badge level-${(course.level || "Beginner").toLowerCase()}`}>
          {course.level || "Beginner"}
        </span>
      </div>

      <div className="card-content">
        <h3 className="card-title" title={course.title}>
          {course.title}
        </h3>
        <p className="card-desc">
          {course.description ? course.description.slice(0, 95) + "..." : "Learn industry-grade concepts from top educators."}
        </p>

        <div className="card-meta">
          <span className="meta-item">👨‍🏫 {instructor}</span>
          <span className="meta-item">⏱️ {course.duration}</span>
        </div>

        <div className="card-stats">
          <span className="rating-pill">⭐ {course.rating ? Number(course.rating).toFixed(1) : "4.5"}</span>
          <span className="enrolled-pill">👥 {course.studentsEnrolled || 0} enrolled</span>
        </div>

        <div className="card-footer">
          <div className="price-tag">
            <span className="currency">₹</span>
            <span className="amount">{course.price}</span>
          </div>

          <div className="card-actions">
            <Link href={`/courses/${course._id}`} className="btn-view">
              Details
            </Link>
            {onEnroll ? (
              <button onClick={() => onEnroll(course._id)} className="btn-enroll">
                Enroll
              </button>
            ) : (
              <Link href={`/courses/${course._id}`} className="btn-enroll">
                Enroll
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
