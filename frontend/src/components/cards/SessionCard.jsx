import { Calendar, GitFork, Star } from 'lucide-react'

function SessionCard({ session }) {
  return (
    <article className="session-card">
      <div className="session-main">
        <div className="session-title-row">
          <h3>{session.name}</h3>
          <span className="pill">{session.language}</span>
        </div>
        <p>{session.description}</p>
        <div className="session-meta">
          {session.stars !== '-' ? <span><Star size={18} /> {session.stars} stars</span> : null}
          {session.commits !== '-' ? <span><GitFork size={18} /> {session.commits} commits</span> : null}
          <span>
            <Calendar size={18} /> Analyzed {session.date}
          </span>
        </div>
      </div>

    </article>
  )
}

export default SessionCard
