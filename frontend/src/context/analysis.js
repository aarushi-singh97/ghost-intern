import { createContext, useContext } from 'react'

export const AnalysisContext = createContext(null)

export function useAnalysis() {
  const context = useContext(AnalysisContext)

  if (!context) {
    throw new Error('useAnalysis must be used inside AnalysisProvider')
  }

  return context
}
