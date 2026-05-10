import { useState } from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

export default function Sidebar({
  isMobile,
  recentRepos = [],
  onSelectRepo,
}) {
  const [showRecent, setShowRecent] =
    useState(false);

  const location = useLocation();

  const navItems = [
    {
      label: "New Analysis",
      path: "/",
    },

    {
      label: "Saved Sessions",
      path: "/sessions",
    },

    {
      label: "Architecture",
      path: "/architecture",
    },

    {
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside
      style={{
        width: isMobile
          ? "100%"
          : "240px",

        height: isMobile
          ? "auto"
          : "100vh",

        position: isMobile
          ? "relative"
          : "fixed",

        left: 0,

        top: 0,

        padding: "28px 18px",

        background:
          "rgba(10,10,15,0.92)",

        borderRight:
          "1px solid rgba(255,255,255,0.06)",

        backdropFilter:
          "blur(20px)",

        zIndex: 20,

        display: "flex",

        flexDirection: "column",

        gap: "24px",

        boxSizing: "border-box",
      }}
    >
      {/* LOGO */}
      <div>
        <h1
          style={{
            color: "white",

            fontSize: "28px",

            fontWeight: 800,

            marginBottom: "6px",
          }}
        >
          Ghost Intern
        </h1>

        <p
          style={{
            color:
              "rgba(255,255,255,0.55)",

            fontSize: "13px",

            lineHeight: 1.5,
          }}
        >
          AI Repository
          Intelligence
        </p>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          display: "flex",

          flexDirection: "column",

          gap: "10px",
        }}
      >
        {navItems.map((item) => {
          const active =
            location.pathname ===
            item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              style={{
                textDecoration:
                  "none",

                background: active
                  ? "linear-gradient(135deg,#4f46e5,#6366f1)"
                  : "transparent",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "white",

                padding:
                  "14px 16px",

                borderRadius:
                  "14px",

                fontSize:
                  "14px",

                fontWeight:
                  active
                    ? 700
                    : 600,

                transition:
                  "all 0.2s ease",

                display: "block",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* RECENT REPOSITORIES */}
      <div>
        <button
          onClick={() =>
            setShowRecent(
              !showRecent
            )
          }
          style={{
            width: "100%",

            background:
              "transparent",

            border:
              "1px solid rgba(255,255,255,0.08)",

            color: "white",

            padding: "14px 16px",

            borderRadius: "14px",

            textAlign: "left",

            cursor: "pointer",

            fontSize: "14px",

            fontWeight: 600,

            marginBottom: "12px",
          }}
        >
          Recent Repositories
        </button>

        {showRecent && (
          <div
            style={{
              display: "flex",

              flexDirection:
                "column",

              gap: "10px",
            }}
          >
            {recentRepos.length ===
            0 ? (
              <p
                style={{
                  color:
                    "rgba(255,255,255,0.45)",

                  fontSize: "13px",
                }}
              >
                No repositories
                analyzed yet.
              </p>
            ) : (
              recentRepos.map(
                (
                  repo,
                  index
                ) => (
                  <button
                    key={index}
                    onClick={() =>
                      onSelectRepo?.(
                        repo
                      )
                    }
                    style={{
                      width: "100%",

                      background:
                        "rgba(255,255,255,0.04)",

                      border:
                        "1px solid rgba(255,255,255,0.06)",

                      color:
                        "white",

                      padding:
                        "12px",

                      borderRadius:
                        "12px",

                      textAlign:
                        "left",

                      cursor:
                        "pointer",

                      fontSize:
                        "13px",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",

                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    {repo}
                  </button>
                )
              )
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "auto",

          padding: "16px",

          borderRadius: "16px",

          background:
            "rgba(255,255,255,0.03)",

          border:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            color:
              "rgba(255,255,255,0.7)",

            fontSize: "13px",

            lineHeight: 1.7,
          }}
        >
          Analyze repositories
          with architecture-aware
          AI reasoning.
        </p>
      </div>
    </aside>
  );
}