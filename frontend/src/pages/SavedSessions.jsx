import { Archive, CalendarDays, Clock, Search, TrendingUp } from 'lucide-react'
import SessionCard from '../components/cards/SessionCard'
import StatsCard from '../components/cards/StatsCard'
import Input from '../components/ui/Input'
import { useAnalysis } from '../context/analysis'

function SavedSessions() {
  const { sessions } = useAnalysis()
  const totalSessions = sessions.length

  return (
    <section className="page">
      <header className="page-header">
        <h2>Saved Sessions</h2>
        <p>Access and manage your previously analyzed repositories</p>
      </header>

      <div className="stats-grid">
        <StatsCard
          icon={Archive}
          value={totalSessions || '0'}
          label="Total Sessions"
          trend={<TrendingUp size={22} />}
        />
        <StatsCard
          icon={CalendarDays}
          value={totalSessions || '0'}
          label="This Month"
          trend={<TrendingUp size={22} />}
        />
        <StatsCard icon={Clock} value={totalSessions || '0'} label="All-Time Analyses" />
      </div>

      <Input className="search-input" icon={Search} placeholder="Search repositories..." />

      {sessions.length ? (
        <div className="session-list">
          {sessions.map((session, index) => (
            <SessionCard key={session.name} session={session} featured={index < 2} />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <h3>No saved sessions yet</h3>
          <p>Analyze a GitHub repository from the New Analysis page to save it here.</p>
        </div>
      )}
    </section>
  )
}

export default SavedSessions
