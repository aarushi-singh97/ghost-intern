function FeatureCard({ icon: Icon, title, description, children }) {
  return (
    <article className="card feature-card">
      <div className="card-icon">
        <Icon size={29} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </article>
  )
}

export default FeatureCard
