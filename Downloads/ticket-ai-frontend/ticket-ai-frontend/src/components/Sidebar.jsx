import { NavLink } from 'react-router-dom'

export default function Sidebar({ currentUser, isAdmin }) {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 border-r border-border bg-surface flex flex-col">
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm ${isAdmin ? 'text-teal' : 'text-amber'}`}>
            ●
          </span>
          <span className="font-display font-semibold text-base tracking-tight">
            Triage
          </span>
        </div>
        <p className="text-xs text-textSecondary mt-1 font-mono">
          {isAdmin ? 'Admin Panel' : 'Employee Portal'}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-surfaceHover text-textPrimary'
                : 'text-textSecondary hover:text-textPrimary hover:bg-surfaceHover'
            }`
          }
        >
          <span className="font-mono text-xs w-3 text-center">◈</span>
          {isAdmin ? 'All Tickets' : 'My Tickets'}
        </NavLink>
      </nav>

      {currentUser && (
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-textSecondary font-mono truncate">
            {currentUser.fullName}
          </p>
          <p className="text-xs text-textSecondary font-mono truncate">
            {currentUser.email}
          </p>
          <p className={`text-xs font-mono mt-1 ${isAdmin ? 'text-teal' : 'text-amber'}`}>
            {isAdmin ? 'Admin' : 'Employee'}
          </p>
        </div>
      )}
    </aside>
  )
}