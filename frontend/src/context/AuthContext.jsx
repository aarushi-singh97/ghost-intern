import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginUser, logoutUser, signupUser } from '../services/api'
import { AuthContext } from './auth'

const TOKEN_KEY = 'ghost-auth-token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(token))

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [token])

  async function signup(formData) {
    const result = await signupUser(formData)
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
  }

  async function login(formData) {
    const result = await loginUser(formData)
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
  }

  async function logout() {
    try {
      await logoutUser()
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
      signup,
      token,
      user,
    }),
    [isLoading, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
