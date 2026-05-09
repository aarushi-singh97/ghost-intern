import { useState, useRef } from "react";

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 15 15"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle
        cx="6.5"
        cy="6.5"
        r="4.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />

      <path
        d="M10 10l3 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RepoInputCard({
  onAnalyze,
  loading,
}) {
  const [url, setUrl] =
    useState("");

  const [error, setError] =
    useState("");

  const [focused, setFocused] =
    useState(false);

  const inputRef = useRef(null);

  const validate = (val) => {
    if (!val.trim()) {
      return "Please enter a GitHub repository URL.";
    }

    if (
      !val.match(
        /^https?:\/\/github\.com\/[^/]+\/[^/]+/
      )
    ) {
      return "Please enter a valid GitHub repository URL.";
    }

    return "";
  };

  const handleSubmit = () => {
    const err = validate(url);

    if (err) {
      setError(err);
      return;
    }

    setError("");

    onAnalyze(url.trim());
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const hasError = !!error;

  return (
    <div
      className="card animate-in"
      style={{
        padding: "22px",

        marginBottom: "18px",
      }}
    >
      <div
        style={{
          display: "flex",

          gap: "12px",

          alignItems: "stretch",

          flexWrap: "wrap",
        }}
      >
        {/* INPUT */}
        <div
          style={{
            flex: 1,

            minWidth: "280px",

            display: "flex",

            alignItems: "center",

            gap: "10px",

            height: "50px",

            padding: "0 16px",

            border: hasError
              ? "1px solid #dc2626"
              : focused
              ? "1px solid var(--accent)"
              : "1px solid var(--border-color)",

            borderRadius: "16px",

            background:
              "var(--glass-bg)",

            backdropFilter:
              "blur(14px)",

            boxShadow: focused
              ? "0 0 0 4px rgba(99,102,241,0.10)"
              : "none",

            transition:
              "all 0.2s ease",
          }}
        >
          <span
            style={{
              color:
                "var(--text-muted)",

              display: "flex",

              alignItems: "center",
            }}
          >
            <SearchIcon />
          </span>

          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);

              if (error) {
                setError("");
              }
            }}
            onFocus={() =>
              setFocused(true)
            }
            onBlur={() =>
              setFocused(false)
            }
            onKeyDown={handleKey}
            placeholder="https://github.com/owner/repository"
            disabled={loading}
            style={{
              flex: 1,

              background:
                "transparent",

              color:
                "var(--text-primary)",

              fontSize: "14px",

              fontWeight: 500,
            }}
          />

          {url && !loading && (
            <button
              onClick={() => {
                setUrl("");

                setError("");

                inputRef.current?.focus();
              }}
              style={{
                width: "24px",

                height: "24px",

                borderRadius: "8px",

                border: "none",

                background:
                  "transparent",

                cursor: "pointer",

                color:
                  "var(--text-muted)",

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                fontSize: "18px",

                transition:
                  "all 0.18s ease",
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={
            loading || !url.trim()
          }
          style={{
            height: "50px",

            minWidth: "140px",

            padding: "0 22px",

            border: "none",

            borderRadius: "16px",

            background:
              loading || !url.trim()
                ? "rgba(99,102,241,0.45)"
                : "linear-gradient(135deg,#4f46e5,#6366f1)",

            color: "#ffffff",

            fontSize: "14px",

            fontWeight: 700,

            cursor:
              loading || !url.trim()
                ? "not-allowed"
                : "pointer",

            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            gap: "8px",

            transition:
              "all 0.22s ease",

            boxShadow:
              loading || !url.trim()
                ? "none"
                : "0 12px 28px rgba(79,70,229,0.24)",

            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (
              !loading &&
              url.trim()
            ) {
              e.target.style.transform =
                "translateY(-2px)";

              e.target.style.boxShadow =
                "0 18px 36px rgba(79,70,229,0.32)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform =
              "translateY(0px)";

            e.target.style.boxShadow =
              loading || !url.trim()
                ? "none"
                : "0 12px 28px rgba(79,70,229,0.24)";
          }}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>

      {/* HINT / ERROR */}
      <p
        style={{
          marginTop: "12px",

          fontSize: "13px",

          color: hasError
            ? "#dc2626"
            : "var(--text-muted)",

          lineHeight: 1.6,

          transition:
            "color 0.2s ease",
        }}
      >
        {hasError
          ? error
          : "Works with any public GitHub repository"}
      </p>
    </div>
  );
}