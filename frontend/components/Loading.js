"use client";

export default function Loading({ message = "Loading data from MongoDB Atlas..." }) {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
}
