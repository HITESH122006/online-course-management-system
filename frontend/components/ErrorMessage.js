"use client";

export default function ErrorMessage({ message, type = "error", onDismiss }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{type === "success" ? "✅" : "⚠️"}</span>
      <span className="alert-msg">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="alert-close">
          &times;
        </button>
      )}
    </div>
  );
}
