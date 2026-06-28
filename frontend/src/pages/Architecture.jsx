import { Activity, Boxes, Code2, FolderTree, Layers3, Package, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import ArchitectureDiagram from '../components/architecture/ArchitectureDiagram'
import DirectoryTree from '../components/architecture/DirectoryTree'
import { useAnalysis } from '../context/analysis'

const technologyCategories = {
  Frontend: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Vite', 'Tailwind CSS', 'Sass'],
  Backend: ['FastAPI', 'Django', 'Flask', 'Express.js', 'NestJS', 'Fastify', 'Pydantic'],
  AI: ['Gemini'],
  Database: ['SQLite', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase'],
}

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function groupTechnologies(analysis, architecture) {
  const technologies = [...new Set(analysis?.techStack || [])]
  const groups = {}

  Object.entries(technologyCategories).forEach(([category, names]) => {
    groups[category] = technologies.filter((technology) => names.includes(technology))
  })

  const filePaths = architecture.files?.map((file) => file.path.toLowerCase()) || []
  if (filePaths.some((path) => path.endsWith('.db') || path.endsWith('database.py'))) {
    groups.Database = [...new Set([...groups.Database, 'SQLite'])]
  }

  const grouped = new Set(Object.values(groups).flat())
  const development = technologies.filter((technology) => !grouped.has(technology))
  if (architecture.packageManager && architecture.packageManager !== 'Unknown') {
    development.push(architecture.packageManager)
  }
  groups.Development = [...new Set(development)]

  return groups
}

function groupDependencies(dependencies) {
  const groups = {
    Frontend: [],
    Backend: [],
    AI: [],
    Runtime: [],
    Development: [],
  }
  const frontendNames = ['react', 'next', 'vue', 'angular', 'svelte', 'vite', 'tailwindcss']
  const backendNames = ['fastapi', 'django', 'flask', 'express', 'nestjs', 'fastify', 'pydantic']
  const aiNames = ['google-generativeai', 'google-genai', 'openai']

  dependencies.forEach((dependency) => {
    const name = dependency.name.toLowerCase()

    if (aiNames.some((item) => name.includes(item))) groups.AI.push(dependency)
    else if (frontendNames.some((item) => name.includes(item))) groups.Frontend.push(dependency)
    else if (backendNames.some((item) => name.includes(item))) groups.Backend.push(dependency)
    else if (dependency.type === 'dev') groups.Development.push(dependency)
    else groups.Runtime.push(dependency)
  })

  return groups
}

function Architecture() {
  const { currentAnalysis } = useAnalysis()
  const architecture = currentAnalysis?.architecture || {}
  const architectureNotes = architecture.notes || []
  const folders = architecture.folders || []
  const files = architecture.files || []
  const dependencies = architecture.dependencies || []
  const languages = architecture.languages || {}
  const metrics = architecture.metrics || {}
  const technologyGroups = groupTechnologies(currentAnalysis, architecture)
  const dependencyGroups = groupDependencies(dependencies)
  const totalLanguageBytes = Object.values(languages).reduce((total, bytes) => total + bytes, 0)
  const recommendationMarker = '## Repository Health'
  const summary = currentAnalysis?.summary || ''
  const recommendations = summary.includes(recommendationMarker)
    ? summary.slice(summary.indexOf(recommendationMarker))
    : ''
  const repositoryName = currentAnalysis?.repo
    ? `${currentAnalysis.repo.owner}/${currentAnalysis.repo.name}`
    : ''

  return (
    <section className="page">
      <header className="page-header">
        <h2>Architecture Insights</h2>
        <p>Repository structure, technologies, dependencies, and health</p>
      </header>

      <article className="card architecture-card">
        <div className="section-title">
          <div className="card-icon"><Boxes size={29} /></div>
          <div>
            <h3>Component Architecture</h3>
            <p>Generated from the latest repository analysis</p>
          </div>
        </div>
        {currentAnalysis ? (
          <ArchitectureDiagram repositoryName={repositoryName} groups={technologyGroups} />
        ) : (
          <div className="empty-state"><h3>No architecture loaded</h3><p>Analyze a repository first.</p></div>
        )}
      </article>

      <article className="card patterns-card">
        <div className="section-title">
          <div className="card-icon"><Layers3 size={29} /></div>
          <h3>Technology Groups</h3>
        </div>
        <div className="pattern-grid">
          {Object.entries(technologyGroups).map(([category, technologies]) => (
            <div className="pattern-box" key={category}>
              <span>{category}</span>
              <strong>{technologies.length ? technologies.join(', ') : 'None detected'}</strong>
            </div>
          ))}
          {architectureNotes.map((note) => (
            <div className="pattern-box" key={note}>
              <span>Architecture Note</span>
              <strong>{note}</strong>
            </div>
          ))}
        </div>
      </article>

      <article className="card list-card directory-card">
        <div className="section-title">
          <div className="card-icon"><FolderTree size={29} /></div>
          <h3>Directory Structure</h3>
        </div>
        <DirectoryTree folders={folders} files={files} />
      </article>

      <article className="card list-card dependency-card">
        <div className="section-title">
          <div className="card-icon"><Package size={29} /></div>
          <h3>Dependencies</h3>
        </div>
        {dependencies.length ? (
          <div className="dependency-groups">
            {Object.entries(dependencyGroups).map(([category, items]) =>
              items.length ? (
                <section key={category}>
                  <h4>{category}</h4>
                  {items.slice(0, 20).map((dependency) => (
                    <div className="dep-row" key={`${category}-${dependency.type}-${dependency.name}`}>
                      <div><strong>{dependency.name}</strong><span>{dependency.version}</span></div>
                      <em>{dependency.type}</em>
                    </div>
                  ))}
                </section>
              ) : null
            )}
          </div>
        ) : (
          <p className="empty-note">No package or Python dependencies were detected.</p>
        )}
      </article>

      <article className="card list-card language-card">
        <div className="section-title">
          <div className="card-icon"><Code2 size={29} /></div>
          <h3>Languages</h3>
        </div>
        {totalLanguageBytes ? (
          <div className="language-list">
            {Object.entries(languages).map(([language, bytes]) => {
              const percentage = Math.round((bytes / totalLanguageBytes) * 100)
              return (
                <div className="language-row" key={language}>
                  <div><strong>{language}</strong><span>{percentage}%</span></div>
                  <div className="language-track"><span style={{ width: `${percentage}%` }} /></div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="empty-note">No language data loaded.</p>
        )}
      </article>

      <article className="card metrics-card">
        <div className="section-title">
          <div className="card-icon"><Activity size={29} /></div>
          <h3>Code Metrics</h3>
        </div>
        <div className="metrics-grid">
          <div><strong>{metrics.fileCount || 0}</strong><span>Total Files</span></div>
          <div><strong>{metrics.folderCount || 0}</strong><span>Total Folders</span></div>
          <div><strong>{metrics.languageCount || 0}</strong><span>Total Languages</span></div>
          <div><strong>{metrics.dependencyCount || 0}</strong><span>Total Dependencies</span></div>
          <div><strong>{formatBytes(metrics.repositorySize)}</strong><span>Repository Size</span></div>
          <div><strong>{formatBytes(metrics.averageFileSize)}</strong><span>Average File Size</span></div>
          <div className="largest-file"><strong>{metrics.largestFile || 'Unknown'}</strong><span>Largest File ({formatBytes(metrics.largestFileSize)})</span></div>
        </div>
      </article>

      <article className="card recommendations-card">
        <div className="section-title">
          <div className="card-icon"><Sparkles size={29} /></div>
          <h3>AI Repository Recommendations</h3>
        </div>
        {recommendations ? (
          <div className="markdown-content"><ReactMarkdown>{recommendations}</ReactMarkdown></div>
        ) : (
          <p className="empty-note">Recommendations will appear after a successful AI analysis.</p>
        )}
      </article>
    </section>
  )
}

export default Architecture
