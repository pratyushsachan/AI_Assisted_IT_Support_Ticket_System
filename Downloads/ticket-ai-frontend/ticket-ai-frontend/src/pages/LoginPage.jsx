import { useState } from 'react'
import { api } from '../api/client'

export default function LoginPage({ role, onLogin, onBack }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await api.login(form)
      // Check if user role matches selected role
      if (role === 'admin' && user.role !== 'ADMIN') {
        setError('This account is not an admin account')
        setLoading(false)
        return
      }
      if (role === 'employee' && user.role !== 'USER') {
        setError('This account is not an employee account')
        setLoading(false)
        return
      }
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = role === 'admin'
  const accentColor = isAdmin ? 'teal' : 'amber'

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm">
        <button
          onClick={onBack}
          className="text-textSecondary text-sm hover:text-textPrimary mb-4 font-mono"
        >
          ← back
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className={`text-${accentColor} font-mono`}>●</span>
            <span className="font-display font-semibold text-xl tracking-tight">
              {isAdmin ? 'Admin Login' : 'Employee Login'}
            </span>
          </div>
          <p className="text-sm text-textSecondary font-mono">
            {isAdmin
              ? 'View all tickets and manage employee issues'
              : 'Raise and manage your support tickets'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-mono text-textSecondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              placeholder={isAdmin ? 'admin@company.com' : 'employee@company.com'}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-textSecondary mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              placeholder="password"
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
            className={`w-full text-base font-semibold text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 ${
              isAdmin ? 'bg-teal' : 'bg-amber'
            }`}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-xs text-textSecondary text-center mt-4 font-mono">
          Backend must be running at localhost:8080
        </p>
      </div>
    </div>
  )
}