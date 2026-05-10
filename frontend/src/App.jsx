import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import { AnalysisProvider } from './context/AnalysisContext'
import { ThemeProvider } from './context/ThemeContext'
import Architecture from './pages/Architecture'
import Home from './pages/Home'
import SavedSessions from './pages/SavedSessions'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <AnalysisProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/saved-sessions" element={<SavedSessions />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </AnalysisProvider>
    </ThemeProvider>
  )
}

export default App
