"use client";

import { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [level, setLevel] = useState("All");

  const categories = [
    "All",
    "Web Development",
    "Programming",
    "Database",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
  ];

  useEffect(() => {
    fetchCourses();
  }, [category, sort, level]);

  const fetchCourses = async (searchQuery = search) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (category !== "All") params.append("category", category);
      if (level !== "All") params.append("level", level);
      if (sort) params.append("sort", sort);

      const res = await fetch(`http://localhost:5000/api/courses?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load courses from API");
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Courses fetch error:", err);
      setError("Unable to load courses from MongoDB backend. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses(search);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
    setSort("newest");
    fetchCourses("");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Catalog</h1>
          <p className="page-subtitle">
            Browse and filter through real MongoDB course records with instantaneous condition queries
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="🔍 Search course title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>

        <div className="filter-controls">
          <div className="select-wrap">
            <label>Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrap">
            <label>Level:</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="select-wrap">
            <label>Sort By:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {(search || category !== "All" || level !== "All" || sort !== "newest") && (
            <button onClick={handleReset} className="btn-reset">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      {/* Catalog Results */}
      {loading ? (
        <Loading message="Filtering MongoDB documents..." />
      ) : courses.length === 0 ? (
        <div className="empty-box">
          <h3>No matching courses found</h3>
          <p>Try searching with different keywords or reset your category filter.</p>
          <button onClick={handleReset} className="btn-primary" style={{ marginTop: "10px" }}>
            View All Courses
          </button>
        </div>
      ) : (
        <>
          <div className="results-count">
            Showing <strong>{courses.length}</strong> {courses.length === 1 ? "course" : "courses"} found in MongoDB
          </div>
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
