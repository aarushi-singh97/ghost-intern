const CATEGORY_META = {
  languages:  { label: "Languages",    type: "lang"  },
  frameworks: { label: "Frameworks",   type: "fw"    },
  build:      { label: "Build tools",  type: "build" },
  databases:  { label: "Databases",    type: "db"    },
  cicd:       { label: "CI/CD",        type: "ci"    },
};

export default function TechStackCard({ techStack }) {
  if (!techStack) return null;

  return (
    <div
      className="card animate-in"
      style={{ padding: "20px", animationDelay: "0.1s" }}
    >
      <div className="section-label" style={{ marginBottom: "16px" }}>Tech stack</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const items = techStack[key];
          if (!items || items.length === 0) return null;
          return (
            <div key={key}>
              <div style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
                marginBottom: "6px",
                fontWeight: 400,
              }}>
                {meta.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {items.map((item) => (
                  <span key={item} className={`badge ${meta.type}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
