"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Check if student is logged in from localStorage
    const stored = localStorage.getItem("studentUser");
    if (stored) {
      try {
        setStudent(JSON.parse(stored));
      } catch (e) {}
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("studentUser");
    localStorage.removeItem("studentToken");
    setStudent(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "All Courses" },
    { href: "/dashboard", label: "Student Dashboard" },
    { href: "/admin", label: "Admin Portal" },
    { href: "/analytics", label: "MongoDB Aggregations" },
  ];

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="logo-badge">MongoDB Atlas</span>
          <span className="logo-title">EduCourse</span>
        </Link>

        <nav className="nav-menu">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-auth">
          {student ? (
            <div className="user-pill">
              <span className="user-name">👤 {student.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link href="/login" className="btn-login">
                Login
              </Link>
              <Link href="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
