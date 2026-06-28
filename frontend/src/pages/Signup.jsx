import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/auth'

function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
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
      await signup(formData)
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
        <h2>Create Account</h2>
        <p>Save analyses and return to them later.</p>
        <label className="field">
          <span>Username</span>
          <input
            value={formData.username}
            onChange={(event) => setFormData({ ...formData, username: event.target.value })}
            required
          />
        </label>
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
            minLength={6}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </Button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  )
}

export default Signup
