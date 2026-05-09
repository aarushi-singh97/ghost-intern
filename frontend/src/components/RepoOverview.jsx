export default function RepoOverview({ repo }) {
  if (!repo) return null;

  return (
    <div className="glass-card repo-overview">
      <div className="repo-glow" />

      <div className="repo-content">
        <div className="repo-top">
          <div>
            <h2 className="repo-title">
              {repo.name}
            </h2>

            <p className="repo-description">
              {repo.description ||
                "No repository description available."}
            </p>
          </div>

          <div className="repo-badge">
            {repo.visibility || "Public"}
          </div>
        </div>

        <div className="repo-stats-grid">
          <StatCard
            label="Stars"
            value={repo.stars || 0}
          />

          <StatCard
            label="Forks"
            value={repo.forks || 0}
          />

          <StatCard
            label="Language"
            value={repo.language || "Unknown"}
          />

          <StatCard
            label="Updated"
            value={repo.updated || "Recently"}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="repo-stat-card">
      <div className="repo-stat-label">
        {label}
      </div>

      <div className="repo-stat-value">
        {value}
      </div>
    </div>
  );
}