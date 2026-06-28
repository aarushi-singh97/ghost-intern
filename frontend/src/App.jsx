import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import { AnalysisProvider } from './context/AnalysisContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Architecture from './pages/Architecture'
import Home from './pages/Home'
import Login from './pages/Login'
import SavedSessions from './pages/SavedSessions'
import Settings from './pages/Settings'
import Signup from './pages/Signup'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnalysisProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-sessions"
                element={
                  <ProtectedRoute>
                    <SavedSessions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/architecture"
                element={
                  <ProtectedRoute>
                    <Architecture />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
        </AnalysisProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
