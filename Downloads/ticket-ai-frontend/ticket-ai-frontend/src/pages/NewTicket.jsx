import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import PriorityBadge from '../components/PriorityBadge'

export default function NewTicket({ currentUser }) {
  const [form, setForm] = useState({ subject: '', description: '' })
  const [phase, setPhase] = useState('form') // form | analyzing | done
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setPhase('analyzing')
    try {
      const ticket = await api.createTicket({
        ...form,
        raisedByUserId: currentUser.id,
      })
      setResult(ticket)
      setPhase('done')
    } catch (err) {
      setError(err.message)
      setPhase('form')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-display font-semibold text-2xl tracking-tight mb-1">
        Raise a ticket
      </h1>
      <p className="text-sm text-textSecondary mb-6">
        Describe the issue — the AI triages it automatically once submitted.
      </p>

      {phase === 'form' && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-mono text-textSecondary mb-1.5">
              Subject
            </label>
            <input
              type="text"
              required
              maxLength={150}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              placeholder="VPN not connecting"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-textSecondary mb-1.5">
              Description
            </label>
            <textarea
              required
              maxLength={2000}
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none"
              placeholder="My laptop can't connect to VPN before my 3pm client call…"
            />
          </div>

          {error && (
            <p className="text-xs text-danger font-mono bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-teal text-base font-semibold text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Submit ticket
          </button>
        </form>
      )}

      {phase === 'analyzing' && (
        <div className="bg-surface border border-border rounded-xl p-6 font-mono text-sm">
          <p className="text-teal flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            analyzing ticket…
          </p>
          <p className="text-textSecondary mt-2 text-xs">
            Sending to AI triage — this takes a couple seconds
          </p>
        </div>
      )}

      {phase === 'done' && result && (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-6 font-mono text-sm space-y-3">
            <p className="text-teal">✓ ticket #{result.id} triaged</p>

            <div className="animate-fadeIn opacity-0" style={{ animationDelay: '0.1s' }}>
              <span className="text-textSecondary">category: </span>
              <span className="text-textPrimary">
                {result.category ? result.category.replace('_', ' ') : 'unclassified'}
              </span>
            </div>

            <div
              className="animate-fadeIn opacity-0 flex items-center gap-2"
              style={{ animationDelay: '0.3s' }}
            >
              <span className="text-textSecondary">priority: </span>
              <PriorityBadge priority={result.priority} />
            </div>

            {result.suggestedResponse && (
              <div className="animate-fadeIn opacity-0" style={{ animationDelay: '0.5s' }}>
                <p className="text-textSecondary mb-1">suggested response:</p>
                <p className="text-textPrimary font-body bg-base border border-border rounded-lg px-3 py-2 text-sm">
                  {result.suggestedResponse}
                </p>
              </div>
            )}

            {!result.category && (
              <p className="text-xs text-textSecondary font-body pt-1">
                AI classification didn't complete — the ticket was still saved
                successfully and can be triaged manually.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/tickets/${result.id}`)}
              className="bg-teal text-base font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              View ticket
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-textSecondary text-sm px-4 py-2 rounded-lg hover:text-textPrimary transition-colors"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
