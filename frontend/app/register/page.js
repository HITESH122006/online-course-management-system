"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorMessage from "../../components/ErrorMessage";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please complete all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed. Duplicate email may already exist.");
      } else {
        setSuccess("Registration successful! Logging you in...");
        localStorage.setItem("studentUser", JSON.stringify(data.student));
        localStorage.setItem("studentToken", data.token);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to reach server. Make sure 'node server.js' is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">New Student Registration</span>
          <h2>Create Your Account</h2>
          <p>Join the Online Course Management platform to enroll in courses</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
        {success && <ErrorMessage message={success} type="success" />}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Kalyani Bile"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Min. 6 chars"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-auth-submit">
            {loading ? "Creating MongoDB Record..." : "Register Now"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign In here</Link>
        </div>
      </div>
    </div>
  );
}
