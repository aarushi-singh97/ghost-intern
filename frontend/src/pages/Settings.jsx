import { Bell, Download, Eye, KeyRound, Shield, Trash2, User } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/ui/Button'
import Toggle from '../components/ui/Toggle'

function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoAnalysis, setAutoAnalysis] = useState(false)

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
          <input value="user@example.com" readOnly />
        </label>
        <label className="field">
          <span>Username</span>
          <input value="ghostdev" readOnly />
        </label>
      </article>

      <article className="card settings-card">
        <div className="section-title">
          <div className="card-icon">
            <KeyRound size={29} />
          </div>
          <h3>API Keys</h3>
        </div>
        <label className="field secret-field">
          <span>GitHub Personal Access Token</span>
          <div>
            <input value="...................." readOnly />
            <Eye size={22} />
          </div>
          <small>Required for accessing private repositories</small>
        </label>
        <label className="field secret-field">
          <span>AI Model API Key</span>
          <div>
            <input value="...................." readOnly />
            <Eye size={22} />
          </div>
        </label>
      </article>

      <article className="card settings-card">
        <div className="section-title">
          <div className="card-icon">
            <Bell size={29} />
          </div>
          <h3>Preferences</h3>
        </div>
        <div className="preference-row">
          <div>
            <strong>Email Notifications</strong>
            <p>Receive updates about analysis completion</p>
          </div>
          <Toggle
            checked={emailNotifications}
            label="Toggle email notifications"
            onChange={() => setEmailNotifications((value) => !value)}
          />
        </div>
        <div className="preference-row">
          <div>
            <strong>Auto-Analysis</strong>
            <p>Automatically analyze dependencies on commit</p>
          </div>
          <Toggle
            checked={autoAnalysis}
            label="Toggle auto analysis"
            onChange={() => setAutoAnalysis((value) => !value)}
          />
        </div>
      </article>

      <article className="card settings-card">
        <div className="section-title">
          <div className="card-icon">
            <Shield size={29} />
          </div>
          <h3>Data & Privacy</h3>
        </div>
        <button className="privacy-action" type="button">
          <Download size={24} />
          <span>
            <strong>Export Data</strong>
            <small>Download all your analysis data</small>
          </span>
        </button>
        <button className="privacy-action" type="button">
          <Trash2 size={24} />
          <span>
            <strong>Clear Sessions</strong>
            <small>Delete all saved analysis sessions</small>
          </span>
        </button>
        <button className="privacy-action danger" type="button">
          <Trash2 size={24} />
          <span>
            <strong>Delete Account</strong>
            <small>Permanently delete your account and all data</small>
          </span>
        </button>
      </article>

      <div className="settings-actions">
        <Button>Save Changes</Button>
      </div>
    </section>
  )
}

export default Settings
