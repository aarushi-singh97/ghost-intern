const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = errorBody?.detail || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return response.json()
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
