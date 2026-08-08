import { useNavigate } from 'react-router-dom'
import PriorityBadge from './PriorityBadge'
import StatusPill from './StatusPill'

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function getBorderColor(status, isAdmin) {
  // Solved/completed = GREEN
  if (status === 'CLOSED' || status === 'RESOLVED') return 'border-teal'

  // Unsolved/in-progress = RED
  if (
    status === 'OPEN' ||
    status === 'TRIAGED' ||
    status === 'IN_PROGRESS' ||
    status === 'AWAITING_CONFIRMATION'
  ) {
    return 'border-danger'
  }

  return 'border-border'
}

export default function TicketRow({ ticket, isAdmin }) {
  const navigate = useNavigate()
  const borderColor = getBorderColor(ticket.status, isAdmin)

  return (
    <button
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className={`w-full text-left px-4 py-3.5 border-b-2 ${borderColor} hover:bg-surfaceHover transition-colors flex items-center gap-4 group`}
    >
      <span className="font-mono text-xs text-textSecondary w-10 shrink-0">
        #{ticket.id}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-textPrimary truncate group-hover:text-teal transition-colors">
          {ticket.subject}
        </p>
        <p className="text-xs text-textSecondary truncate mt-0.5">
          {ticket.category ? ticket.category.replace('_', ' ') : 'Unclassified'} ·{' '}
          {ticket.raisedByEmail}
        </p>
      </div>

      <div className="shrink-0 w-24">
        <PriorityBadge priority={ticket.priority} />
      </div>

      <div className="shrink-0">
        <StatusPill status={ticket.status} />
      </div>

      <span className="shrink-0 text-xs text-textSecondary font-mono w-16 text-right">
        {timeAgo(ticket.createdAt)}
      </span>
    </button>
  )
}