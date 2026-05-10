import Layout from "../components/Layout";

export default function Architecture() {
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
        Architecture
      </h1>

      <div
        className="card"
        style={{
          padding: "24px",
          color: "white",
          lineHeight: 1.8,
        }}
      >
        <p>
          Frontend built with React +
          Vite.
        </p>

        <p>
          Backend powered by FastAPI.
        </p>

        <p>
          Repository analysis uses AI
          inference and GitHub API
          processing.
        </p>

        <p>
          Local storage is used for
          recent repository persistence.
        </p>
      </div>
    </Layout>
  );
}