import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import TicketRow from '../components/TicketRow'

const FILTERS = [
  { value: null, label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'TRIAGED', label: 'Triaged' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'AWAITING_CONFIRMATION', label: 'Awaiting Confirmation' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
]

export default function AdminDashboard({ currentUser }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .getAllTickets(filter)
      .then((data) => {
        if (!cancelled) setTickets(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [filter])

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl tracking-tight">
          All Tickets
        </h1>
        <p className="text-sm text-textSecondary mt-1">
          {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} total
        </p>
      </div>

      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`text-xs font-mono px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              filter === f.value
                ? 'bg-surfaceHover text-textPrimary border border-border'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading && (
          <p className="text-sm text-textSecondary font-mono px-4 py-8 text-center">
            Loading tickets…
          </p>
        )}

        {error && (
          <p className="text-sm text-danger font-mono px-4 py-8 text-center">
            {error}
          </p>
        )}

        {!loading && !error && tickets.length === 0 && (
          <p className="text-sm text-textSecondary px-4 py-8 text-center">
            No tickets yet.
          </p>
        )}

        {!loading &&
          !error &&
          tickets.map((ticket) => (
            <TicketRow key={ticket.id} ticket={ticket} isAdmin={true} />
          ))}
      </div>
    </div>
  )
}