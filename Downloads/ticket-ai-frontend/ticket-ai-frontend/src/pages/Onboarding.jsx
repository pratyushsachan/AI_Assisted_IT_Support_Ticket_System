import { useState } from 'react'
import { api } from '../api/client'

// No real auth yet (that's Phase 3 on the backend) — this just registers
// a user via the existing /api/users/register endpoint and remembers
// their id locally so the rest of the app has someone to attach tickets to.
export default function Onboarding({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await api.registerUser(form)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-teal font-mono">●</span>
            <span className="font-display font-semibold text-xl tracking-tight">Triage</span>
          </div>
          <p className="text-sm text-textSecondary font-mono">AI support desk — get started</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-mono text-textSecondary mb-1.5">
              Full name
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              placeholder="Pratyush Sachan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-textSecondary mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-textSecondary mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="text-xs text-danger font-mono bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-base font-semibold text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Get started'}
          </button>
        </form>

        <p className="text-xs text-textSecondary text-center mt-4 font-mono">
          Backend must be running at localhost:8080
        </p>
      </div>
    </div>
  )
}
