import { useEffect, useMemo, useState } from 'react'
import { AnalysisContext } from './analysis'

const STORAGE_KEY = 'ghost-analysis-sessions'

function normalizeSession(analysis) {
  const today = new Date().toISOString().slice(0, 10)
  const primaryTech = analysis.techStack?.[0] || 'Unknown'

  return {
    id: `${analysis.repo.owner}/${analysis.repo.name}`,
    name: `${analysis.repo.owner}/${analysis.repo.name}`,
    language: primaryTech,
    description: analysis.repo.description || 'No description available',
    stars: '-',
    commits: '-',
    date: today,
    analysis,
  }
}

export function AnalysisProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [currentAnalysis, setCurrentAnalysis] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedSessions = saved ? JSON.parse(saved) : []
    return savedSessions[0]?.analysis || null
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  function saveAnalysis(analysis) {
    const nextSession = normalizeSession(analysis)
    setCurrentAnalysis(analysis)
    setSessions((current) => [
      nextSession,
      ...current.filter((session) => session.id !== nextSession.id),
    ])
  }

  const value = useMemo(
    () => ({
      currentAnalysis,
      sessions,
      saveAnalysis,
    }),
    [currentAnalysis, sessions]
  )

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}
