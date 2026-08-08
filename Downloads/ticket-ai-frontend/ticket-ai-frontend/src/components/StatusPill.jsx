const STATUS_CONFIG = {
  OPEN: { label: 'Open', dot: 'bg-textSecondary' },
  TRIAGED: { label: 'Triaged', dot: 'bg-teal' },
  IN_PROGRESS: { label: 'In progress', dot: 'bg-amber' },
  RESOLVED: { label: 'Resolved', dot: 'bg-teal' },
  CLOSED: { label: 'Closed', dot: 'bg-textSecondary' },
}

export default function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-full bg-surfaceHover border border-border text-textPrimary">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
