"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError(
        "Please enter your registered email."
      );
      return;
    }

    if (!newPassword) {
      setError(
        "Please enter your new password."
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Please confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/students/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            newPassword,
            confirmPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reset password."
        );
      }

      setMessage(
        data.message ||
          "Password reset successfully."
      );

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err) {
      console.error(
        "Forgot Password Error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          Reset Password
        </h1>

        <p style={styles.subtitle}>
          Enter your registered email and create
          a new password.
        </p>

        <form onSubmit={handleSubmit}>

          <label style={styles.label}>
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="Enter your registered email"
            style={styles.input}
          />


          <label style={styles.label}>
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="Enter new password"
            style={styles.input}
          />


          <label style={styles.label}>
            Confirm New Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(
                e.target.value
              );
              setError("");
              setMessage("");
            }}
            placeholder="Confirm new password"
            style={styles.input}
          />


          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}


          {message && (
            <div style={styles.success}>
              {message}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.resetButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer"
            }}
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>

        </form>


        <button
          type="button"
          onClick={() =>
            router.push("/login")
          }
          style={styles.backButton}
        >
          ← Back to Login
        </button>

      </div>
    </div>
  );
}


const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow:
      "0 4px 15px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box"
  },

  title: {
    textAlign: "center",
    margin: "0 0 10px 0",
    color: "#222222",
    fontSize: "28px"
  },

  subtitle: {
    textAlign: "center",
    color: "#666666",
    margin: "0 0 25px 0",
    lineHeight: "1.5",
    fontSize: "15px"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333333"
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
    marginBottom: "18px"
  },

  resetButton: {
    width: "100%",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "13px",
    borderRadius: "7px",
    fontSize: "16px",
    fontWeight: "600"
  },

  backButton: {
    width: "100%",
    marginTop: "15px",
    background: "transparent",
    color: "#2563eb",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    fontSize: "15px"
  },

  error: {
    background: "#fef2f2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px"
  },

  success: {
    background: "#ecfdf5",
    color: "#166534",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px"
  }
};