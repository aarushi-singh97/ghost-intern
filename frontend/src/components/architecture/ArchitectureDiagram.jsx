function ArchitectureDiagram({ repositoryName, groups }) {
  const entries = Object.entries(groups).filter(([, technologies]) => technologies.length)
  const visibleEntries = entries.length ? entries : [['Repository', ['No stack detected']]]
  const width = 900
  const categoryY = 145
  const detailY = 270

  return (
    <div className="architecture-diagram" role="img" aria-label="Repository component diagram">
      <svg viewBox={`0 0 ${width} 350`}>
        <rect className="diagram-node diagram-root" x="330" y="24" width="240" height="62" rx="14" />
        <text className="diagram-title" x="450" y="52" textAnchor="middle">
          GitHub Repository
        </text>
        <text className="diagram-label" x="450" y="72" textAnchor="middle">
          {repositoryName || 'Analyzed repository'}
        </text>

        {visibleEntries.map(([category, technologies], index) => {
          const x = ((index + 1) * width) / (visibleEntries.length + 1)
          const detail = technologies.slice(0, 3).join(' • ')

          return (
            <g key={category}>
              <line className="diagram-line" x1="450" y1="86" x2={x} y2={categoryY} />
              <rect
                className="diagram-node"
                x={x - 72}
                y={categoryY - 25}
                width="144"
                height="50"
                rx="12"
              />
              <text className="diagram-title" x={x} y={categoryY + 5} textAnchor="middle">
                {category}
              </text>
              <line className="diagram-line" x1={x} y1={categoryY + 25} x2={x} y2={detailY - 24} />
              <rect
                className="diagram-node diagram-detail"
                x={x - 82}
                y={detailY - 24}
                width="164"
                height="58"
                rx="12"
              />
              <text className="diagram-label" x={x} y={detailY + 2} textAnchor="middle">
                {detail || 'Detected component'}
              </text>
              {technologies.length > 3 ? (
                <text className="diagram-label" x={x} y={detailY + 21} textAnchor="middle">
                  +{technologies.length - 3} more
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default ArchitectureDiagram
