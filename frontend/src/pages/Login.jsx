import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/auth'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(formData)
      navigate('/home')
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p>Access your repository analyses.</p>
        <label className="field">
          <span>Email</span>
          <input
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            type="email"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            type="password"
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
        <p>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </section>
  )
}

export default Login
