import Sidebar from "./Sidebar";

export default function Layout({
  children,
}) {
  return (
    <div className="hero-glow">
      <Sidebar />

      <main
        style={{
          marginLeft: "240px",
          minHeight: "100vh",
          padding: "48px 32px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}