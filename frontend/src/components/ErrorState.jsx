function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1"/>
      <path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export default function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      padding: "20px 24px",
      border: "0.5px solid var(--red-border)",
      background: "var(--red-bg)",
      borderRadius: "var(--radius)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      animation: "fadeIn 0.25s ease both",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--red)" }}>
        <AlertIcon />
        <span style={{ fontSize: "14px", color: "var(--red)", fontWeight: 400 }}>
          {message || "Something went wrong. Please check the URL and try again."}
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "none",
            border: "0.5px solid var(--red-border)",
            color: "var(--red)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 14px",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
