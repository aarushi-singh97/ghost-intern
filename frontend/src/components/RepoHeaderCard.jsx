function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M8 1h3v3M11 1L6.5 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
      <path d="M5.5 3.5V5.5l1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6.5 9l-3 1.5.5-3.5L1.5 4.5 5 4z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="3" cy="3" r="1.5" stroke="currentColor" strokeWidth="1"/>
      <circle cx="10" cy="3" r="1.5" stroke="currentColor" strokeWidth="1"/>
      <circle cx="6.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1"/>
      <path d="M3 4.5v2a3.5 3.5 0 003.5 3.5M10 4.5v2A3.5 3.5 0 016.5 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

export default function RepoHeaderCard({ repo }) {
  if (!repo) return null;
  const { name, fullName, description, url, stars, forks, analyzedAt, cached } = repo;

  return (
    <div
      className="card animate-in"
      style={{
        padding: "20px 24px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "20px",
        marginBottom: "16px",
        animationDelay: "0.05s",
      }}
    >
      {/* Left */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px" }}>
          <span style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "var(--text-primary)",
            letterSpacing: "-0.015em",
          }}>
            {fullName || name}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", display: "flex", alignItems: "center", lineHeight: 1 }}
          >
            <ExternalLinkIcon />
          </a>
        </div>

        {description && (
          <p style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            maxWidth: "480px",
            marginBottom: "8px",
          }}>
            {description}
          </p>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          color: "var(--text-tertiary)",
          fontSize: "11px",
        }}>
          <ClockIcon />
          <span>analyzed {analyzedAt || "just now"} · {cached ? "cached" : "not cached"}</span>
        </div>
      </div>

      {/* Right: stats */}
      <div style={{ display: "flex", gap: "28px", flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "var(--text-tertiary)", marginBottom: "3px" }}>
            <StarIcon />
          </div>
          <div style={{ fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {formatCount(stars ?? 0)}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "2px" }}>stars</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "var(--text-tertiary)", marginBottom: "3px" }}>
            <ForkIcon />
          </div>
          <div style={{ fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {formatCount(forks ?? 0)}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "2px" }}>forks</div>
        </div>
      </div>
    </div>
  );
}
