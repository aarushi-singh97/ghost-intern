export default function HeroSection() {
  return (
    <div style={{
      textAlign: "center",
      marginBottom: "32px",
      paddingTop: "48px",
      animation: "fadeInUp 0.4s ease both",
    }}>
      <h1 style={{
        fontSize: "22px",
        fontWeight: 500,
        color: "var(--text-primary)",
        letterSpacing: "-0.025em",
        marginBottom: "10px",
        lineHeight: 1.3,
      }}>
        Understand any GitHub repository instantly
      </h1>
      <p style={{
        fontSize: "14px",
        fontWeight: 400,
        color: "var(--text-secondary)",
        lineHeight: 1.7,
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        Paste a URL and get AI-powered architecture insights, tech stack detection,
        and a built-in Q&A assistant.
      </p>
    </div>
  );
}
