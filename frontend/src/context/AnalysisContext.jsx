import { useEffect, useMemo, useState } from 'react'
import { getAnalysisHistory } from '../services/api'
import { AnalysisContext } from './analysis'
import { useAuth } from './auth'

const STORAGE_KEY = 'ghost-analysis-sessions'

function loadSavedSessions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function normalizeSession(analysis) {
  const today = new Date().toISOString().slice(0, 10)
  const repo = analysis?.repo || {}
  const primaryTech = analysis?.techStack?.[0] || 'Unknown'
  const name = `${repo.owner || 'unknown'}/${repo.name || 'repository'}`

  return {
    id: name,
    name,
    language: primaryTech,
    description: repo.description || 'No description available',
    stars: '-',
    commits: '-',
    date: today,
    analysis,
  }
}

function normalizeHistoryItem(item) {
  const analysis = item.analysis_result || {}
  const primaryTech = analysis.techStack?.[0] || 'Unknown'

  return {
    id: String(item.id),
    name: item.repository_name || 'Unknown repository',
    language: primaryTech,
    description: analysis.repo?.description || 'No description available',
    stars: '-',
    commits: '-',
    date: item.created_at?.slice(0, 10) || 'Unknown',
    analysis,
  }
}

export function AnalysisProvider({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const [sessions, setSessions] = useState(loadSavedSessions)
  const [currentAnalysis, setCurrentAnalysis] = useState(
    () => loadSavedSessions()[0]?.analysis || null
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    async function loadHistory() {
      if (isLoading) {
        return
      }

      if (!isAuthenticated) {
        setCurrentAnalysis(null)
        setSessions([])
        return
      }

      try {
        const history = await getAnalysisHistory()
        const nextSessions = history.map(normalizeHistoryItem)
        setSessions(nextSessions)
        setCurrentAnalysis(nextSessions[0]?.analysis || null)
      } catch {
        setSessions([])
        setCurrentAnalysis(null)
      }
    }

    loadHistory()
  }, [isAuthenticated, isLoading])

  function saveAnalysis(analysis) {
    if (!analysis?.repo) {
      return
    }

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
