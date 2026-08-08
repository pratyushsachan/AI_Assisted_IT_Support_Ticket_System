import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import PriorityBadge from '../components/PriorityBadge'
import StatusPill from '../components/StatusPill'
import TicketChat from '../components/TicketChat'

export default function TicketDetail({ currentUser, isAdmin }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadTicket()
  }, [id])

  async function loadTicket() {
    try {
      const data = await api.getTicket(id)
      setTicket(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function updateStatus(newStatus) {
    setUpdating(true)
    try {
      const updated = await api.updateTicketStatus(id, newStatus)
      setTicket(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <p className="text-danger font-mono text-sm">{error}</p>
        <button onClick={() => navigate('/')} className="text-teal text-sm mt-3 hover:underline">
          ← Back
        </button>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <p className="text-textSecondary font-mono text-sm">Loading…</p>
      </div>
    )
  }

  const isSolved = ticket.status === 'CLOSED' || ticket.status === 'RESOLVED'
  const needsEmployeeConfirmation = ticket.status === 'AWAITING_CONFIRMATION'
  const isInProgress = ticket.status === 'IN_PROGRESS'
  const showChat = isInProgress || needsEmployeeConfirmation || ticket.status === 'RESOLVED'

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-textSecondary text-sm hover:text-textPrimary transition-colors mb-4"
      >
        ← Back to dashboard
      </button>

      <div
        className={`bg-surface border-2 rounded-xl p-6 ${
          isSolved ? 'border-teal' : 'border-danger'
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-mono text-textSecondary mb-1">
              #{ticket.id} · {ticket.raisedByEmail}
            </p>
            <h1 className="font-display font-semibold text-xl tracking-tight">
              {ticket.subject}
            </h1>
          </div>
          <StatusPill status={ticket.status} />
        </div>

        <p className="text-sm text-textPrimary leading-relaxed mb-5 whitespace-pre-wrap">
          {ticket.description}
        </p>

        <div className="flex items-center gap-6 pb-5 border-b border-border">
          <div>
            <p className="text-xs font-mono text-textSecondary mb-1">Category</p>
            <p className="text-sm">
              {ticket.category ? ticket.category.replace('_', ' ') : 'Unclassified'}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono text-textSecondary mb-1">Priority</p>
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        {ticket.suggestedResponse && (
          <div className="pt-5">
            <p className="text-xs font-mono text-textSecondary mb-2">AI suggested response</p>
            <p className="text-sm text-textPrimary bg-base border border-border rounded-lg px-3 py-2.5 leading-relaxed">
              {ticket.suggestedResponse}
            </p>
          </div>
        )}

        {/* ===== ADMIN ACTIONS ===== */}
        {isAdmin && !isSolved && (
          <div className="pt-5 mt-5 border-t border-border space-y-2">
            <p className="text-xs font-mono text-textSecondary mb-2">Admin actions</p>
            <div className="flex flex-wrap gap-2">
              {ticket.suggestedResponse && ticket.status !== 'AWAITING_CONFIRMATION' && (
                <button
                  disabled={updating}
                  onClick={() => updateStatus('AWAITING_CONFIRMATION')}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal text-base font-semibold hover:opacity-90 transition-opacity"
                >
                  AI solved it — send for employee confirmation
                </button>
              )}
              {ticket.status !== 'IN_PROGRESS' && (
                <button
                  disabled={updating}
                  onClick={() => updateStatus('IN_PROGRESS')}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border text-textPrimary hover:border-amber transition-colors"
                >
                  AI couldn't solve it — handle manually
                </button>
              )}
              {ticket.status === 'IN_PROGRESS' && (
                <button
                  disabled={updating}
                  onClick={() => updateStatus('RESOLVED')}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal text-base font-semibold hover:opacity-90 transition-opacity"
                >
                  I've resolved it — send for employee confirmation
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== EMPLOYEE CONFIRMATION ===== */}
        {!isAdmin && needsEmployeeConfirmation && (
          <div className="pt-5 mt-5 border-t border-border">
            <p className="text-sm font-semibold text-textPrimary mb-3">
              Is your problem solved?
            </p>
            <div className="flex gap-2">
              <button
                disabled={updating}
                onClick={() => updateStatus('CLOSED')}
                className="bg-teal text-base font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Yes, solved
              </button>
              <button
                disabled={updating}
                onClick={() => updateStatus('IN_PROGRESS')}
                className="bg-danger text-base font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                No, still need help
              </button>
            </div>
          </div>
        )}

        {!isAdmin && ticket.status === 'RESOLVED' && (
          <div className="pt-5 mt-5 border-t border-border">
            <p className="text-sm font-semibold text-textPrimary mb-3">
              Admin marked this resolved — is your problem solved?
            </p>
            <div className="flex gap-2">
              <button
                disabled={updating}
                onClick={() => updateStatus('CLOSED')}
                className="bg-teal text-base font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Yes, solved
              </button>
              <button
                disabled={updating}
                onClick={() => updateStatus('IN_PROGRESS')}
                className="bg-danger text-base font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                No, still need help
              </button>
            </div>
          </div>
        )}

        {isSolved && (
          <div className="pt-5 mt-5 border-t border-border">
            <p className="text-sm text-teal font-mono">✓ This ticket is closed</p>
          </div>
        )}

        {/* ===== CHAT ===== */}
        {showChat && (
          <TicketChat
            ticketId={ticket.id}
            currentUserId={currentUser.id}
            currentUserEmail={currentUser.email}
          />
        )}
      </div>
    </div>
  )
}