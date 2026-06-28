const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function getToken() {
  return localStorage.getItem('ghost-auth-token')
}

async function request(path, options = {}) {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = errorBody?.detail || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return response.json()
}

export function signupUser(userData) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export function loginUser(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser() {
  return request('/auth/me')
}

export function logoutUser() {
  return request('/auth/logout', {
    method: 'POST',
  })
}

export function analyzeRepository(repoUrl) {
  return request('/analyze/', {
    method: 'POST',
    body: JSON.stringify({ repo_url: repoUrl }),
  })
}

export function askRepositoryQuestion(question, context) {
  return request('/ask/', {
    method: 'POST',
    body: JSON.stringify({ question, context }),
  })
}

export function getAnalysisHistory() {
  return request('/analyze/history')
}

export function exportUserData() {
  return request('/export/')
}
