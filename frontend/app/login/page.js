"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =========================
     LOGIN FUNCTION
  ========================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check fields
    if (!email || !password) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Sending login request..."
      );

      const response = await fetch(
        "http://localhost:5000/api/students/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password
          })
        }
      );

      const data = await response.json();

      console.log(
        "Login API Response:",
        data
      );


      // Login failed
      if (!response.ok) {
        setError(
          data.message ||
            "Invalid email or password."
        );

        setLoading(false);
        return;
      }


      // Check student data
      if (!data.student) {
        setError(
          "Login successful, but student data was not received."
        );

        setLoading(false);
        return;
      }


      console.log(
        "Student received from backend:",
        data.student
      );


      // Get MongoDB ID
      const studentId =
        data.student.id ||
        data.student._id;


      console.log(
        "Student MongoDB ID:",
        studentId
      );


      // Check MongoDB ID
      if (
        !studentId ||
        typeof studentId !== "string" ||
        studentId.length !== 24
      ) {
        setError(
          "Invalid student ID received from server."
        );

        setLoading(false);
        return;
      }


      // Create student object
      const studentData = {
        id: studentId,

        studentId:
          data.student.studentId,

        name:
          data.student.name,

        email:
          data.student.email,

        phone:
          data.student.phone || ""
      };


      console.log(
        "Student data to save:",
        studentData
      );


      // SAVE STUDENT IN LOCAL STORAGE
      localStorage.setItem(
        "student",
        JSON.stringify(studentData)
      );


      // Verify localStorage
      const savedStudent =
        localStorage.getItem(
          "student"
        );


      console.log(
        "Student saved in localStorage:",
        savedStudent
      );


      if (!savedStudent) {
        setError(
          "Unable to save login information."
        );

        setLoading(false);
        return;
      }


      setSuccess(
        "Login successful! Redirecting..."
      );

      setLoading(false);


      // Go to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      setError(
        "Unable to connect to server. Make sure the backend is running."
      );

      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>

      <div style={styles.card}>

        {/* TITLE */}

        <h1 style={styles.title}>
          Online Course Management System
        </h1>


        <h2 style={styles.subtitle}>
          Student Login
        </h2>


        <p style={styles.description}>
          Login to access your courses and
          learning dashboard.
        </p>


        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}


        {/* FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Email Address
            </label>


            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="Enter your email"
              style={styles.input}
              disabled={loading}
            />

          </div>


          {/* PASSWORD */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Password
            </label>


            <div
              style={
                styles.passwordContainer
              }
            >

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                placeholder="Enter your password"

                style={
                  styles.passwordInput
                }

                disabled={loading}
              />


              {/* SHOW / HIDE PASSWORD */}

              <button
                type="button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                style={
                  styles.eyeButton
                }
              >

                {showPassword ? (

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    <path
                      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />

                  </svg>

                ) : (

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    <path
                      d="M3 3l18 18"
                    />

                    <path
                      d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
                    />

                    <path
                      d="M9.88 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a18.6 18.6 0 0 1-3.17 4.11"
                    />

                    <path
                      d="M6.61 6.61C3.68 8.58 2 12 2 12s3 7 10 7a10.9 10.9 0 0 0 4.39-.91"
                    />

                  </svg>

                )}

              </button>

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}

            style={{
              ...styles.loginButton,

              opacity:
                loading
                  ? 0.7
                  : 1
            }}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>


          {/* FORGOT PASSWORD */}

          <p style={styles.forgotText}>

            <button
              type="button"

              onClick={() =>
                router.push(
                  "/forgot-password"
                )
              }

              style={
                styles.forgotButton
              }
            >
              Forgot Password?
            </button>

          </p>

        </form>


        {/* REGISTER */}

        <p style={styles.registerText}>

          Don't have an account?{" "}

          <button
            type="button"

            onClick={() =>
              router.push(
                "/register"
              )
            }

            style={
              styles.registerButton
            }
          >
            Register
          </button>

        </p>

      </div>

    </div>
  );
}


/* =========================
   STYLES
========================= */

const styles = {

  /* PAGE BACKGROUND */

  container: {
    minHeight: "100vh",

    background:
      "linear-gradient(rgba(10, 20, 40, 0.55), rgba(10, 20, 40, 0.55)), url('https://plus.unsplash.com/premium_photo-1661670152522-8db946b83f81?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8')",

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundAttachment: "fixed",

    backgroundRepeat: "no-repeat",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "20px"
  },


  /* LOGIN CARD */

  card: {
    width: "100%",

    maxWidth: "450px",

    background: "white",

    padding: "35px",

    borderRadius: "12px",

    boxShadow:
      "0 4px 15px rgba(0,0,0,0.1)"
  },


  /* TITLE */

  title: {
    textAlign: "center",

    color: "#2563eb",

    fontSize: "24px",

    marginBottom: "10px"
  },


  /* SUBTITLE */

  subtitle: {
    textAlign: "center",

    color: "#222",

    fontSize: "26px",

    marginBottom: "8px"
  },


  /* DESCRIPTION */

  description: {
    textAlign: "center",

    color: "#666",

    marginBottom: "25px"
  },


  /* FORM GROUP */

  formGroup: {
    marginBottom: "20px"
  },


  /* LABEL */

  label: {
    display: "block",

    marginBottom: "7px",

    fontWeight: "600",

    color: "#333"
  },


  /* EMAIL INPUT */

  input: {
    width: "100%",

    padding: "12px",

    border:
      "1px solid #ccc",

    borderRadius: "6px",

    fontSize: "16px",

    boxSizing: "border-box"
  },


  /* PASSWORD CONTAINER */

  passwordContainer: {
    position: "relative",

    width: "100%"
  },


  /* PASSWORD INPUT */

  passwordInput: {
    width: "100%",

    padding:
      "12px 45px 12px 12px",

    border:
      "1px solid #ccc",

    borderRadius: "6px",

    fontSize: "16px",

    boxSizing: "border-box"
  },


  /* EYE BUTTON */

  eyeButton: {
    position: "absolute",

    right: "10px",

    top: "50%",

    transform:
      "translateY(-50%)",

    background: "none",

    border: "none",

    cursor: "pointer",

    color: "#555",

    display: "flex",

    alignItems: "center",

    justifyContent: "center"
  },


  /* LOGIN BUTTON */

  loginButton: {
    width: "100%",

    padding: "13px",

    background: "#2563eb",

    color: "white",

    border: "none",

    borderRadius: "6px",

    cursor: "pointer",

    fontSize: "16px",

    fontWeight: "600"
  },


  /* FORGOT PASSWORD */

  forgotText: {
    textAlign: "right",

    marginTop: "12px",

    marginBottom: "5px"
  },


  forgotButton: {
    background: "none",

    border: "none",

    color: "#2563eb",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "14px"
  },


  /* ERROR */

  error: {
    background: "#fee2e2",

    color: "#991b1b",

    padding: "12px",

    borderRadius: "6px",

    marginBottom: "20px",

    fontSize: "14px"
  },


  /* SUCCESS */

  success: {
    background: "#dcfce7",

    color: "#166534",

    padding: "12px",

    borderRadius: "6px",

    marginBottom: "20px",

    fontSize: "14px"
  },


  /* REGISTER */

  registerText: {
    textAlign: "center",

    marginTop: "25px",

    color: "#666"
  },


  registerButton: {
    background: "none",

    border: "none",

    color: "#2563eb",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "15px"
  }

};