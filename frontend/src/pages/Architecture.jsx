import { Activity, Boxes, FolderTree, Layers3, Package } from 'lucide-react'
import { useAnalysis } from '../context/analysis'

const patterns = [
  ['Design Pattern', 'Component-based Architecture'],
  ['State Management', 'Redux + Context API'],
  ['Routing', 'React Router v6'],
  ['Build Tool', 'Vite'],
]

function Architecture() {
  const { currentAnalysis } = useAnalysis()
  const architectureNotes = currentAnalysis?.architectureNotes || [
    'Run an analysis to load repository-specific architecture notes.',
  ]
  const keyFiles = currentAnalysis?.keyFiles?.length ? currentAnalysis.keyFiles : ['README.md', 'package.json']
  const dependencies = currentAnalysis?.techStack?.length
    ? currentAnalysis.techStack.map((tech) => [tech, 'detected', 'runtime'])
    : [['No stack detected yet', 'analyze a repo', 'info']]

  return (
    <section className="page">
      <header className="page-header">
        <h2>Architecture Insights</h2>
        <p>Deep analysis of code structure, patterns, and dependencies</p>
      </header>

      <article className="card architecture-card">
        <div className="section-title">
          <div className="card-icon">
            <Boxes size={29} />
          </div>
          <div>
            <h3>Component Architecture</h3>
            <p>Visual representation of system components</p>
          </div>
        </div>
        <div className="diagram-panel">
          <Boxes size={76} />
          <strong>
            {currentAnalysis
              ? `${currentAnalysis.repo.owner}/${currentAnalysis.repo.name}`
              : 'Architecture diagram visualization'}
          </strong>
          <span>
            {currentAnalysis
              ? 'Generated from the latest backend analysis'
              : 'Interactive component hierarchy map'}
          </span>
        </div>
      </article>

      <article className="card patterns-card">
        <div className="section-title">
          <div className="card-icon">
            <Layers3 size={29} />
          </div>
          <h3>Key Patterns</h3>
        </div>
        <div className="pattern-grid">
          {patterns.map(([label, value]) => (
            <div className="pattern-box" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
          {architectureNotes.map((note) => (
            <div className="pattern-box" key={note}>
              <span>Backend Note</span>
              <strong>{note}</strong>
            </div>
          ))}
        </div>
      </article>

      <div className="two-column">
        <article className="card list-card">
          <div className="section-title">
            <div className="card-icon">
              <FolderTree size={29} />
            </div>
            <h3>Directory Structure</h3>
          </div>
          {keyFiles.map((name) => (
            <div className="list-row" key={name}>
              <span>
                <FolderTree size={20} /> {name}
              </span>
              <em>key file</em>
            </div>
          ))}
        </article>

        <article className="card list-card">
          <div className="section-title">
            <div className="card-icon">
              <Package size={29} />
            </div>
            <h3>Dependencies</h3>
          </div>
          {dependencies.map(([name, version, type]) => (
            <div className="dep-row" key={name}>
              <div>
                <strong>{name}</strong>
                <span>{version}</span>
              </div>
              <em>{type}</em>
            </div>
          ))}
        </article>
      </div>

      <article className="card metrics-card">
        <div className="section-title">
          <div className="card-icon">
            <Activity size={29} />
          </div>
          <h3>Code Metrics</h3>
        </div>
        <div className="metrics-grid">
          <div>
            <strong>1,247</strong>
            <span>Total Files</span>
          </div>
          <div>
            <strong>124k</strong>
            <span>Lines of Code</span>
          </div>
          <div>
            <strong>87%</strong>
            <span>Test Coverage</span>
          </div>
          <div>
            <strong>A+</strong>
            <span>Code Quality</span>
          </div>
        </div>
      </article>
    </section>
  )
}

export default Architecture
