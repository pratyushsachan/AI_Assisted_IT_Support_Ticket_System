import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import TicketRow from '../components/TicketRow'

export default function EmployeeDashboard({ currentUser }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [formData, setFormData] = useState({ subject: '', description: '' })
  const navigate = useNavigate()

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    try {
      const data = await api.getTicketsByUser(currentUser.id)
      setTickets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTicket(e) {
    e.preventDefault()
    try {
      await api.createTicket({
        ...formData,
        raisedByUserId: currentUser.id,
      })
      setFormData({ subject: '', description: '' })
      setShowNewForm(false)
      await loadTickets()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl tracking-tight">
          My Support Tickets
        </h1>
        <p className="text-sm text-textSecondary mt-1">
          {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
        </p>
      </div>

      <button
        onClick={() => setShowNewForm(!showNewForm)}
        className="bg-amber text-base font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity mb-6"
      >
        + Raise a ticket
      </button>

      {showNewForm && (
        <div className="bg-surface border border-border rounded-xl p-6 mb-6 space-y-4">
          <h2 className="font-display font-semibold">We're here to help</h2>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-textSecondary mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                maxLength={150}
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber"
                placeholder="What's the issue?"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-textSecondary mb-1.5">
                Description
              </label>
              <textarea
                required
                maxLength={2000}
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber resize-none"
                placeholder="Describe the issue in detail…"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-amber text-base font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit ticket
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="text-textSecondary text-sm px-4 py-2 rounded-lg hover:text-textPrimary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading && (
          <p className="text-sm text-textSecondary font-mono px-4 py-8 text-center">
            Loading your tickets…
          </p>
        )}

        {error && (
          <p className="text-sm text-danger font-mono px-4 py-8 text-center">
            {error}
          </p>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-textSecondary">No tickets yet.</p>
            <button
              onClick={() => setShowNewForm(true)}
              className="text-sm text-amber mt-2 hover:underline"
            >
              Raise your first ticket
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          tickets.map((ticket) => (
            <TicketRow key={ticket.id} ticket={ticket} isAdmin={false} />
          ))}
      </div>
    </div>
  )
}