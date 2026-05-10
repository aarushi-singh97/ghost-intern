import { Bookmark, Boxes, Home, Moon, Settings, Sparkles, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/theme'

const navItems = [
  { label: 'New Analysis', to: '/home', icon: Home },
  { label: 'Saved Sessions', to: '/saved-sessions', icon: Bookmark },
  { label: 'Architecture', to: '/architecture', icon: Boxes },
  { label: 'Settings', to: '/settings', icon: Settings },
]

function Sidebar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={21} />
          </div>
          <div>
            <h1>Ghost Intern</h1>
            <p>AI Repository Intelligence</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink key={item.to} to={item.to} className="nav-link">
                <Icon size={23} strokeWidth={1.9} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="status-card">
          <span className="status-dot" />
          <div>
            <strong>System Active</strong>
            <p>AI models ready for repository analysis</p>
          </div>
        </div>

        <button className="theme-button" type="button" onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
