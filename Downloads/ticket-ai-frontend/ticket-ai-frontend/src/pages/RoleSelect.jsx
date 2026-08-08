export default function RoleSelect({ onSelectRole }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-teal font-mono">●</span>
            <span className="font-display font-semibold text-2xl tracking-tight">
              Triage
            </span>
          </div>
          <p className="text-sm text-textSecondary font-mono">
            AI support desk — select your role
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelectRole('admin')}
            className="w-full bg-surface border-2 border-border rounded-xl p-6 hover:border-teal transition-colors text-left"
          >
            <p className="font-display font-semibold text-teal mb-1">Admin</p>
            <p className="text-xs text-textSecondary">
              View all tickets, manage employee issues, confirm resolutions
            </p>
          </button>

          <button
            onClick={() => onSelectRole('employee')}
            className="w-full bg-surface border-2 border-border rounded-xl p-6 hover:border-amber transition-colors text-left"
          >
            <p className="font-display font-semibold text-amber mb-1">Employee</p>
            <p className="text-xs text-textSecondary">
              Raise support tickets, chat with admin, confirm when issue is solved
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}