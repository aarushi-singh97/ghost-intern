const SKELETON_ROWS = [
  { w: "60%", h: "14px" },
  { w: "80%", h: "14px" },
  { w: "45%", h: "14px" },
];

function SkeletonLine({ width, height = "12px", style = {} }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: "4px",
      background: "var(--border)",
      animation: "shimmer 1.4s ease-in-out infinite",
      ...style,
    }} />
  );
}

export default function LoadingState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Repo header skeleton */}
      <div className="card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <SkeletonLine width="200px" height="16px" />
          <SkeletonLine width="340px" height="12px" />
          <SkeletonLine width="130px" height="10px" />
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          {[0, 1].map(i => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
              <SkeletonLine width="36px" height="18px" />
              <SkeletonLine width="28px" height="10px" />
            </div>
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[0, 1].map(col => (
          <div key={col} className="card" style={{ padding: "20px" }}>
            <SkeletonLine width="80px" height="10px" style={{ marginBottom: "16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {SKELETON_ROWS.map((r, i) => (
                <SkeletonLine key={i} width={r.w} height={r.h} style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary skeleton */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <SkeletonLine width="90px" height="22px" style={{ borderRadius: "20px", marginBottom: "14px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["90%", "75%", "82%", "60%"].map((w, i) => (
            <SkeletonLine key={i} width={w} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
