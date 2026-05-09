function FileIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 1h5l3 3v8a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M8 1v3h3" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

export default function KeyFilesCard({ files }) {
  if (!files || files.length === 0) return null;

  return (
    <div
      className="card animate-in"
      style={{ padding: "20px", animationDelay: "0.12s" }}
    >
      <div className="section-label" style={{ marginBottom: "16px" }}>Key files</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {files.map((path, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-tertiary)",
              padding: "4px 0",
            }}
          >
            <FileIcon />
            <span
              className="mono"
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {path}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
