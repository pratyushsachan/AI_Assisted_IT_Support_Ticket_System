import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import TicketRow from '../components/TicketRow'

const FILTERS = [
  { value: null, label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'TRIAGED', label: 'Triaged' },
  { value: 'RESOLVED', label: 'Resolved' },
]

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState(null)
  const navigate = useNavigate()

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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl tracking-tight">Tickets</h1>
          <p className="text-sm text-textSecondary mt-1">
            {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
          </p>
        </div>
        <button
          onClick={() => navigate('/new')}
          className="bg-teal text-base font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + New ticket
        </button>
      </div>

      <div className="flex items-center gap-1 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`text-xs font-mono px-3 py-1.5 rounded-full transition-colors ${
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
            {error} — is the backend running at localhost:8080?
          </p>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-textSecondary">No tickets yet.</p>
            <button
              onClick={() => navigate('/new')}
              className="text-sm text-teal mt-2 hover:underline"
            >
              Raise your first ticket
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)}
      </div>
    </div>
  )
}
