import { Archive, CalendarDays, Clock, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import SessionCard from '../components/cards/SessionCard'
import StatsCard from '../components/cards/StatsCard'
import Input from '../components/ui/Input'
import { useAnalysis } from '../context/analysis'

function SavedSessions() {
  const { sessions } = useAnalysis()
  const [search, setSearch] = useState('')
  const totalSessions = sessions.length
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlySessions = sessions.filter((session) => session.date.startsWith(currentMonth)).length
  const visibleSessions = sessions.filter((session) =>
    session.name.toLowerCase().includes(search.trim().toLowerCase())
  )

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
          value={monthlySessions || '0'}
          label="This Month"
          trend={<TrendingUp size={22} />}
        />
        <StatsCard icon={Clock} value={totalSessions || '0'} label="All-Time Analyses" />
      </div>

      <Input
        className="search-input"
        icon={Search}
        placeholder="Search repositories..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {visibleSessions.length ? (
        <div className="session-list">
          {visibleSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <h3>{sessions.length ? 'No matching sessions' : 'No saved sessions yet'}</h3>
          <p>
            {sessions.length
              ? 'Try a different repository name.'
              : 'Analyze a GitHub repository from the New Analysis page to save it here.'}
          </p>
        </div>
      )}
    </section>
  )
}

export default SavedSessions
