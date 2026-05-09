export default function ThemeToggle({
  dark,
  setDark,
}) {
  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        width: "46px",
        height: "46px",

        borderRadius: "14px",

        border:
          "1px solid var(--border-color)",

        background: "var(--card-bg)",

        color: "var(--text-primary)",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        cursor: "pointer",

        fontSize: "18px",

        backdropFilter: "blur(16px)",

        boxShadow: "var(--shadow-soft)",

        transition: "all 0.2s ease",
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}