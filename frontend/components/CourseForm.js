"use client";

import { useState, useEffect } from "react";

export default function CourseForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructorName: "Senior Instructor",
    category: "Web Development",
    duration: "30 Hours",
    price: 799,
    level: "Beginner",
    image: "",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        instructorName:
          initialData.instructor && typeof initialData.instructor === "object"
            ? initialData.instructor.name
            : initialData.instructorName || "Senior Instructor",
        category: initialData.category || "Web Development",
        duration: initialData.duration || "30 Hours",
        price: initialData.price !== undefined ? initialData.price : 799,
        level: initialData.level || "Beginner",
        image: initialData.image || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Frontend validation
    if (!formData.title.trim()) {
      setValidationError("Course title is required");
      return;
    }
    if (!formData.description.trim()) {
      setValidationError("Course description is required");
      return;
    }
    if (!formData.duration.trim()) {
      setValidationError("Duration is required (e.g. '30 Hours')");
      return;
    }
    if (formData.price === "" || Number(formData.price) < 0) {
      setValidationError("Please enter a valid price (>= 0)");
      return;
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      image:
        formData.image.trim() ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      {validationError && <div className="alert alert-error">{validationError}</div>}

      <div className="form-group">
        <label>Course Title *</label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Master React 19 & Next.js"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Brief explanation of course contents and objectives..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="Database">Database</option>
            <option value="Data Science">Data Science</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Difficulty Level</label>
          <select name="level" value={formData.level} onChange={handleChange}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Instructor Name</label>
          <input
            type="text"
            name="instructorName"
            placeholder="e.g. Dr. Angela Yu"
            value={formData.instructorName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Duration *</label>
          <input
            type="text"
            name="duration"
            placeholder="e.g. 40 Hours"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (₹) *</label>
          <input
            type="number"
            name="price"
            min="0"
            placeholder="999"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Course Image URL (Optional)</label>
        <input
          type="url"
          name="image"
          placeholder="https://images.unsplash.com/..."
          value={formData.image}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        )}
        <button type="submit" disabled={isSubmitting} className="btn-submit">
          {isSubmitting ? "Saving to MongoDB..." : initialData ? "Update Course in MongoDB" : "Insert Course into MongoDB"}
        </button>
      </div>
    </form>
  );
}
