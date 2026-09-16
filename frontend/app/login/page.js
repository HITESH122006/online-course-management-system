"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorMessage from "../../components/ErrorMessage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password");
      } else {
        setSuccess("Login successful! Redirecting to student dashboard...");
        localStorage.setItem("studentUser", JSON.stringify(data.student));
        localStorage.setItem("studentToken", data.token);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to backend server. Make sure 'node server.js' is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("student123");
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Student Portal</span>
          <h2>Sign In to Your Account</h2>
          <p>Access your enrolled MongoDB courses and track learning progress</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
        {success && <ErrorMessage message={success} type="success" />}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-auth-submit">
            {loading ? "Verifying with MongoDB..." : "Sign In"}
          </button>
        </form>

        {/* Quick Demo Credentials Box for College Viva */}
        <div className="demo-credentials-box">
          <h4>💡 Quick Demo Accounts (1-Click Test for Viva)</h4>
          <p>Click any pre-seeded student account below:</p>
          <div className="demo-chips">
            <button
              type="button"
              onClick={() => handleDemoFill("rahul.sharma@example.com")}
              className="chip-btn"
            >
              Rahul Sharma
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("priya.patel@example.com")}
              className="chip-btn"
            >
              Priya Patel
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("aarav.d@example.com")}
              className="chip-btn"
            >
              Aarav Deshmukh
            </button>
          </div>
          <span className="pass-hint">Demo Password: <code>student123</code></span>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link href="/register">Register as New Student</Link>
        </div>
      </div>
    </div>
  );
}
