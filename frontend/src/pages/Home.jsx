import {
  Bot,
  Code2,
  FileText,
  GitBranch,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import FeatureCard from '../components/cards/FeatureCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAnalysis } from '../context/analysis'
import { analyzeRepository, askRepositoryQuestion } from '../services/api'

const features = [
  {
    icon: GitBranch,
    title: 'Repository Overview',
    description: 'Stars, forks, contributors, and activity metrics',
    body: (
      <dl className="mini-stats">
        <div>
          <dt>Stars</dt>
          <dd>12.4k</dd>
        </div>
        <div>
          <dt>Contributors</dt>
          <dd>234</dd>
        </div>
      </dl>
    ),
  },
  {
    icon: Code2,
    title: 'Tech Stack Detection',
    description: 'Automatically identify frameworks and technologies',
    body: (
      <div className="tag-row">
        <span>React</span>
        <span>TypeScript</span>
        <span>Node.js</span>
      </div>
    ),
  },
  {
    icon: TrendingUp,
    title: 'Architecture Analysis',
    description: 'Deep dive into code structure and patterns',
    body: <p className="feature-note">Component hierarchy, design patterns, and best practices</p>,
  },
  {
    icon: Sparkles,
    title: 'AI Summary',
    description: 'Natural language summary of repository purpose, structure, and key features',
  },
  {
    icon: FileText,
    title: 'Key Files',
    description: 'Most important files ranked by complexity and dependencies',
  },
  {
    icon: MessageSquare,
    title: 'Developer Q&A Chat',
    description: 'Ask questions about the codebase and get AI-powered answers',
  },
]

function formatSummary(summary) {
  if (!summary) {
    return 'No AI summary returned yet.'
  }

  if (summary.startsWith('429') || summary.includes('Quota exceeded')) {
    return (
      'AI summary is temporarily unavailable because the Gemini API quota has been reached. '
      + 'Repository metadata, detected stack, key files, and architecture notes are still available.'
    )
  }

  return summary
}

function Home() {
  const { currentAnalysis, saveAnalysis } = useAnalysis()
  const [repoUrl, setRepoUrl] = useState('https://github.com/facebook/react')
  const [analysis, setAnalysis] = useState(currentAnalysis)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isAsking, setIsAsking] = useState(false)

  const repoTitle = useMemo(() => {
    if (!analysis?.repo) {
      return ''
    }

    return `${analysis.repo.owner}/${analysis.repo.name}`
  }, [analysis])

  async function handleAnalyze(event) {
    event.preventDefault()
    setError('')
    setAnalysis(null)
    setIsLoading(true)

    try {
      const result = await analyzeRepository(repoUrl.trim())
      setAnalysis(result)
      saveAnalysis(result)
    } catch (apiError) {
      setError(apiError.message || 'Unable to analyze this repository right now.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAsk(event) {
    event.preventDefault()

    if (!analysis || !question.trim()) {
      return
    }

    setIsAsking(true)
    setAnswer('')

    try {
      const result = await askRepositoryQuestion(question.trim(), analysis)
      setAnswer(result.answer)
    } catch (apiError) {
      setAnswer(apiError.message || 'Unable to answer that question right now.')
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <section className="page page-home">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="workspace-pill">
            <Bot size={20} /> Ghost Intelligence Workspace
          </span>
          <h2>
            Analyze repositories with <span className="no-break">AI-powered</span> intelligence
          </h2>
          <p>
            Gain deep insights into code architecture, detect tech stacks automatically, and
            understand complex codebases with advanced AI analysis. Perfect for developers,
            architects, and engineering teams.
          </p>
        </div>

        <aside className="engine-card card">
          <h3>AI Analysis Engine</h3>
          <div className="engine-status">
            <span className="status-dot" /> Active
          </div>
          <p>Real-time repository processing active</p>
        </aside>
      </div>

      <form className="repo-form" onSubmit={handleAnalyze}>
        <Input
          icon={GitBranch}
          placeholder="https://github.com/owner/repository"
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          <Sparkles size={23} />
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
        <p>{error || 'Works with any public GitHub repository'}</p>
      </form>

      {analysis ? (
        <article className="analysis-result card">
          <div>
            <span className="pill">Live backend result</span>
            <h3>{repoTitle}</h3>
            <p>{analysis.repo.description}</p>
          </div>

          <div className="result-grid">
            <section>
              <h4>Detected Stack</h4>
              <div className="tag-row">
                {analysis.techStack.length ? (
                  analysis.techStack.map((tech) => <span key={tech}>{tech}</span>)
                ) : (
                  <span>No package stack detected</span>
                )}
              </div>
            </section>

            <section>
              <h4>Key Files</h4>
              <ul>
                {analysis.keyFiles.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <h4>AI Summary</h4>
            <p>{formatSummary(analysis.summary)}</p>
          </section>

          <section>
            <h4>Architecture Notes</h4>
            <ul>
              {analysis.architectureNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <form className="qa-form" onSubmit={handleAsk}>
            <h4>Ask the Backend</h4>
            <div className="qa-input-row">
              <Input
                placeholder="Ask something about this repository..."
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
              <Button type="submit" disabled={isAsking || !question.trim()}>
                {isAsking ? 'Asking...' : 'Ask'}
              </Button>
            </div>
            {answer ? <p className="qa-answer">{answer}</p> : null}
          </form>
        </article>
      ) : null}

      <div className="feature-grid">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          >
            {feature.body}
          </FeatureCard>
        ))}
      </div>

      <div className="save-banner">
        <div className="card-icon">
          <GitBranch size={25} />
        </div>
        <div>
          <h3>Save Your Analysis Sessions</h3>
          <p>
            All analyzed repositories are automatically saved. Access them anytime from the Saved
            Sessions page.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Home
