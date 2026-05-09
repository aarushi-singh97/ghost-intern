export default function AnalysisGrid({
  children,
}) {
  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "1.2fr 0.8fr",

        gap: "24px",

        marginTop: "28px",

        alignItems: "start",
      }}
    >
      {children}
    </div>
  );
}