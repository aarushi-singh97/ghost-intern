export default function WorkspaceHeader({
  isMobile,
}) {
  return (
    <div
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        alignItems: isMobile
          ? "flex-start"
          : "center",

        flexDirection: isMobile
          ? "column"
          : "row",

        gap: isMobile
          ? "28px"
          : "40px",

        marginBottom: isMobile
          ? "38px"
          : "56px",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          width: "100%",

          maxWidth: "760px",
        }}
      >
        {/* BADGE */}
        <div
          style={{
            display: "inline-flex",

            alignItems: "center",

            gap: "10px",

            padding: "8px 14px",

            borderRadius: "999px",

            background:
              "var(--accent-soft)",

            border:
              "1px solid rgba(99,102,241,0.12)",

            color:
              "var(--accent)",

            fontSize: "13px",

            fontWeight: 600,

            marginBottom: "22px",

            backdropFilter:
              "blur(10px)",
          }}
        >
          👻 Ghost Intelligence Workspace
        </div>

        {/* TITLE */}
        <div
          style={{
            fontSize:
              "clamp(34px, 6vw, 58px)",

            fontWeight: 800,

            lineHeight: 1.02,

            letterSpacing:
              "-0.05em",

            color:
              "var(--text-primary)",

            maxWidth: "760px",
          }}
        >
          Analyze repositories with
          AI-powered intelligence
        </div>

        {/* DESCRIPTION */}
        <div
          style={{
            marginTop: "22px",

            color:
              "var(--text-secondary)",

            fontSize:
              "clamp(15px, 2vw, 17px)",

            lineHeight: 1.85,

            maxWidth: "680px",

            fontWeight: 500,
          }}
        >
          Explore repository
          architecture, technologies,
          code structure, and developer
          insights through an
          intelligent analysis
          workspace designed for
          engineers.
        </div>
      </div>

      {/* STATUS CARD */}
      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "14px",

          padding: "16px 18px",

          borderRadius: "20px",

          background:
            "var(--card-bg)",

          border:
            "1px solid var(--border-color)",

          backdropFilter:
            "blur(14px)",

          boxShadow:
            "var(--shadow-soft)",

          minWidth: isMobile
            ? "100%"
            : "260px",

          width: isMobile
            ? "100%"
            : "auto",

          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "12px",

            height: "12px",

            borderRadius: "50%",

            background: "#22c55e",

            boxShadow:
              "0 0 12px rgba(34,197,94,0.55)",

            flexShrink: 0,
          }}
        />

        <div>
          <div
            style={{
              color:
                "var(--text-primary)",

              fontSize: "14px",

              fontWeight: 700,
            }}
          >
            AI Analysis Engine
          </div>

          <div
            style={{
              marginTop: "3px",

              color:
                "var(--text-muted)",

              fontSize: "12px",

              lineHeight: 1.6,
            }}
          >
            Real-time repository
            processing active
          </div>
        </div>
      </div>
    </div>
  );
}