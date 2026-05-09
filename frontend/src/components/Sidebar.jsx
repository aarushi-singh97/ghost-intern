export default function Sidebar({
  isMobile,
}) {
  const navItems = [
    "New Analysis",
    "Recent Repositories",
    "Saved Sessions",
    "Architecture",
    "Settings",
  ];

  if (isMobile) {
    return (
      <div
        style={{
          position: "sticky",

          top: 0,

          zIndex: 100,

          width: "100%",

          padding: "14px 18px",

          backdropFilter: "blur(18px)",

          WebkitBackdropFilter:
            "blur(18px)",

          background:
            "var(--sidebar-bg)",

          borderBottom:
            "1px solid var(--border-color)",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",

              height: "42px",

              borderRadius: "14px",

              background:
                "linear-gradient(135deg,#4f46e5,#6366f1)",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",

              fontSize: "18px",

              color: "#fff",

              boxShadow:
                "0 10px 24px rgba(79,70,229,0.22)",
            }}
          >
            👻
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,

                fontSize: "15px",

                color:
                  "var(--text-primary)",
              }}
            >
              Ghost Intern
            </div>

            <div
              style={{
                fontSize: "11px",

                marginTop: "2px",

                color:
                  "var(--text-muted)",
              }}
            >
              AI Repository Intelligence
            </div>
          </div>
        </div>

        <button
          style={{
            border:
              "1px solid var(--border-color)",

            background:
              "var(--card-bg)",

            color:
              "var(--text-secondary)",

            padding: "10px 14px",

            borderRadius: "14px",

            fontSize: "13px",

            fontWeight: 600,

            cursor: "pointer",
          }}
        >
          Menu
        </button>
      </div>
    );
  }

  return (
    <aside
      style={{
        width: "240px",

        height: "100vh",

        position: "fixed",

        top: 0,

        left: 0,

        padding: "24px 18px",

        display: "flex",

        flexDirection: "column",

        justifyContent:
          "space-between",

        background:
          "var(--sidebar-bg)",

        borderRight:
          "1px solid var(--border-color)",

        backdropFilter: "blur(18px)",

        WebkitBackdropFilter:
          "blur(18px)",

        zIndex: 50,

        boxSizing: "border-box",
      }}
    >
      <div>
        {/* LOGO */}
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "14px",

            marginBottom: "44px",
          }}
        >
          <div
            style={{
              width: "52px",

              height: "52px",

              borderRadius: "18px",

              background:
                "linear-gradient(135deg,#4f46e5,#6366f1)",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",

              fontSize: "20px",

              color: "#fff",

              boxShadow:
                "0 14px 30px rgba(79,70,229,0.20)",

              flexShrink: 0,
            }}
          >
            👻
          </div>

          <div>
            <div
              style={{
                fontWeight: 800,

                fontSize: "17px",

                color:
                  "var(--text-primary)",

                letterSpacing:
                  "-0.02em",
              }}
            >
              Ghost Intern
            </div>

            <div
              style={{
                marginTop: "4px",

                fontSize: "12px",

                color:
                  "var(--text-muted)",

                lineHeight: 1.5,
              }}
            >
              AI Repository Intelligence
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav
          style={{
            display: "flex",

            flexDirection: "column",

            gap: "8px",
          }}
        >
          {navItems.map(
            (item, index) => (
              <button
                key={item}
                style={{
                  background:
                    index === 0
                      ? "rgba(79,70,229,0.08)"
                      : "transparent",

                  border:
                    index === 0
                      ? "1px solid rgba(79,70,229,0.12)"
                      : "1px solid transparent",

                  color:
                    index === 0
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",

                  padding: "14px 16px",

                  borderRadius: "16px",

                  textAlign: "left",

                  fontSize: "14px",

                  fontWeight:
                    index === 0
                      ? 700
                      : 500,

                  transition:
                    "all 0.18s ease",

                  cursor: "pointer",

                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (index !== 0) {
                    e.target.style.background =
                      "var(--hover-bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== 0) {
                    e.target.style.background =
                      "transparent";
                  }
                }}
              >
                {item}
              </button>
            )
          )}
        </nav>
      </div>

      {/* INFO CARD */}
      <div
        style={{
          padding: "20px",

          borderRadius: "22px",

          background:
            "var(--card-bg)",

          border:
            "1px solid var(--border-color)",

          backdropFilter:
            "blur(12px)",

          boxShadow:
            "var(--shadow-soft)",
        }}
      >
        <div
          style={{
            fontSize: "13px",

            color:
              "var(--text-secondary)",

            lineHeight: 1.8,

            fontWeight: 500,
          }}
        >
          Analyze repositories with
          architecture-aware AI reasoning,
          repository intelligence,
          and developer-focused insights.
        </div>
      </div>
    </aside>
  );
}