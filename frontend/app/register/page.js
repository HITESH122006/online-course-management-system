"use client";

import { useState } from "react";

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a17.3 17.3 0 0 1-3.2 4.4" />
      <path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 8 10 8c1.7 0 3.2-.5 4.5-1.2" />
    </svg>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !form.studentId.trim() ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId: form.studentId,
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      setMessage(
        data.message || "Student registered successfully"
      );

      setForm({
        studentId: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to server. Make sure the backend is running."
      );
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fb",
        padding: "30px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          backgroundColor: "#ffffff",
          padding: "35px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#1f2937"
          }}
        >
          Student Registration
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Student ID */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "7px"
              }}
            >
              Student ID *
            </label>

            <input
              type="text"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "7px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "7px"
              }}
            >
              Full Name *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "7px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "7px"
              }}
            >
              Email Address *
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "7px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "7px"
              }}
            >
              Phone Number (Optional)
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "7px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "7px"
              }}
            >
              Password *
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                style={{
                  width: "100%",
                  padding: "14px 50px 14px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "7px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "7px"
              }}
            >
              Confirm Password *
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                style={{
                  width: "100%",
                  padding: "14px 50px 14px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "7px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "20px"
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div
              style={{
                backgroundColor: "#dcfce7",
                color: "#15803d",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "20px"
              }}
            >
              {message}
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#9ca3af" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "7px",
              fontSize: "17px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Registering..." : "Register Now"}
          </button>

        </form>
      </div>
    </div>
  );
}