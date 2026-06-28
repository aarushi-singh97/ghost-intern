import { Download, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/auth'
import { exportUserData } from '../services/api'

function Settings() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')

  function showMessage(nextMessage) {
    setMessage(nextMessage)
    window.setTimeout(() => setMessage(''), 3500)
  }

  async function handleExportData() {
    try {
      const payload = await exportUserData()
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = 'ghost-intern-analysis-data.json'
      link.click()
      URL.revokeObjectURL(url)
      showMessage('Analysis data exported.')
    } catch (error) {
      showMessage(error.message || 'Unable to export analysis data.')
    }
  }

  return (
    <section className="page settings-page">
      <header className="page-header">
        <h2>Settings</h2>
        <p>Manage your account, preferences, and integrations</p>
      </header>

      <article className="card settings-card">
        <div className="section-title">
          <div className="card-icon">
            <User size={29} />
          </div>
          <h3>Account Settings</h3>
        </div>
        <label className="field">
          <span>Email Address</span>
          <input value={user?.email || ''} readOnly />
        </label>
        <label className="field">
          <span>Username</span>
          <input value={user?.username || ''} readOnly />
        </label>
        <label className="field">
          <span>Created At</span>
          <input value={user?.created_at || ''} readOnly />
        </label>
      </article>

      <article className="card settings-card">
        <div className="section-title">
          <div className="card-icon">
            <Download size={29} />
          </div>
          <h3>Export Data</h3>
        </div>
        <button className="privacy-action" type="button" onClick={handleExportData}>
          <Download size={24} />
          <span>
            <strong>Export Data</strong>
            <small>Download all your analysis data</small>
          </span>
        </button>
      </article>

      <div className="settings-actions">
        {message ? <p className="settings-message">{message}</p> : null}
      </div>
    </section>
  )
}

export default Settings
