import Layout from "../components/Layout";

export default function SavedSessions() {
  return (
    <Layout>
      <h1
        style={{
          fontSize: "56px",
          fontWeight: 800,
          marginBottom: "40px",
          color: "white",
        }}
      >
        Saved Sessions
      </h1>

      <div
        className="card"
        style={{
          padding: "24px",
          color: "white",
        }}
      >
        Session saving feature coming soon.
      </div>
    </Layout>
  );
}