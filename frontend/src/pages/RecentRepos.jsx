import Layout from "../components/Layout";

export default function RecentRepos() {
  const repos = JSON.parse(
    localStorage.getItem("recentRepos") || "[]"
  );

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
        Recent Repositories
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {repos.length === 0 ? (
          <div className="card" style={{ padding: "24px" }}>
            <p style={{ color: "white" }}>
              No repositories analyzed yet.
            </p>
          </div>
        ) : (
          repos.map((repo, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: "20px",
                color: "white",
              }}
            >
              {repo}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}