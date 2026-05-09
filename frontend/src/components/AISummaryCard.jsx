function SparklesIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1l.75 2.75L9.5 4.5l-2.75.75L6 8l-.75-2.75L2.5 4.5l2.75-.75L6 1z" fill="currentColor"/>
      <path d="M9.5 8l.4 1.1L11 9.5l-1.1.4L9.5 11l-.4-1.1L8 9.5l1.1-.4L9.5 8z" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}

function BlueprintIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1"/>
      <path d="M1 4h10M4 4v7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  );
}

// Renders text with inline `code` blocks
function FormattedText({ text }) {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function AISummaryCard({ summary, architectureNotes }) {
  if (!summary && !architectureNotes) return null;

  return (
    <div
      className="card animate-in"
      style={{ overflow: "hidden", animationDelay: "0.15s" }}
    >
      {/* AI Summary */}
      {summary && (
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span className="pill-label">
              <SparklesIcon />
              AI summary
            </span>
          </div>
          <p style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            fontWeight: 400,
          }}>
            <FormattedText text={summary} />
          </p>
        </div>
      )}

      {/* Divider */}
      {summary && architectureNotes && <hr className="divider" />}

      {/* Architecture Notes */}
      {architectureNotes && (
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span className="pill-label">
              <BlueprintIcon />
              Architecture notes
            </span>
          </div>
          <p style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            fontWeight: 400,
          }}>
            <FormattedText text={architectureNotes} />
          </p>
        </div>
      )}
    </div>
  );
}
