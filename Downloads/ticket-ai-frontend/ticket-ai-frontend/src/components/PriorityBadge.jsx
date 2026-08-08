const PRIORITY_CONFIG = {
  P1_CRITICAL: { bars: 4, label: 'Critical', color: 'bg-danger' },
  P2_HIGH: { bars: 3, label: 'High', color: 'bg-amber' },
  P3_MEDIUM: { bars: 2, label: 'Medium', color: 'bg-teal' },
  P4_LOW: { bars: 1, label: 'Low', color: 'bg-textSecondary' },
}

// Signal-strength bars as the priority indicator — a literal callback to
// the "network/IT support" domain instead of a generic colored pill.
export default function PriorityBadge({ priority }) {
  if (!priority) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-textSecondary">
        <span className="flex items-end gap-0.5 h-3">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 bg-border rounded-sm"
              style={{ height: `${i * 3}px` }}
            />
          ))}
        </span>
        pending
      </span>
    )
  }

  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.P3_MEDIUM

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-textPrimary">
      <span className="flex items-end gap-0.5 h-3">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`w-1 rounded-sm transition-colors ${
              i <= config.bars ? config.color : 'bg-border'
            }`}
            style={{ height: `${i * 3}px` }}
          />
        ))}
      </span>
      {config.label}
    </span>
  )
}
