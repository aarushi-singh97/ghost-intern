function StatsCard({ icon: Icon, value, label, trend }) {
  return (
    <article className="card stat-card">
      <div className="card-icon">
        <Icon size={28} />
      </div>
      {trend ? <span className="trend">{trend}</span> : null}
      <strong>{value}</strong>
      <p>{label}</p>
    </article>
  )
}

export default StatsCard
