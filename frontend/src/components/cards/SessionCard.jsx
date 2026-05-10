import { Calendar, GitFork, Star, Trash2, Download } from 'lucide-react'

function SessionCard({ session, featured = false }) {
  return (
    <article className={`session-card ${featured ? 'featured' : ''}`}>
      <div className="session-main">
        <div className="session-title-row">
          <h3>{session.name}</h3>
          <span className="pill">{session.language}</span>
        </div>
        <p>{session.description}</p>
        <div className="session-meta">
          <span>
            <Star size={18} /> {session.stars} stars
          </span>
          <span>
            <GitFork size={18} /> {session.commits} commits
          </span>
          <span>
            <Calendar size={18} /> Analyzed {session.date}
          </span>
        </div>
      </div>

      {featured ? (
        <div className="session-actions" aria-label={`${session.name} actions`}>
          <button className="icon-action" type="button" aria-label="Download analysis">
            <Download size={22} />
          </button>
          <button className="icon-action danger" type="button" aria-label="Delete session">
            <Trash2 size={22} />
          </button>
        </div>
      ) : null}
    </article>
  )
}

export default SessionCard
