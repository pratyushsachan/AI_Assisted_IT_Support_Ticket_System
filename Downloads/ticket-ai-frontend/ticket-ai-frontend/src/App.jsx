import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import RoleSelect from './pages/RoleSelect'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import TicketDetail from './pages/TicketDetail'

const STORAGE_KEY = 'ticketai_current_user'

export default function App() {
  const [roleSelect, setRoleSelect] = useState(null) // null | 'admin' | 'employee'
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  function handleRoleSelect(role) {
    setRoleSelect(role)
  }

  function handleLogin(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    setCurrentUser(user)
    setRoleSelect(null) // clear role selection after login
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY)
    setCurrentUser(null)
    setRoleSelect(null)
  }

  // No user, no role selected yet
  if (!currentUser && !roleSelect) {
    return <RoleSelect onSelectRole={handleRoleSelect} />
  }

  // User selected a role but hasn't logged in yet
  if (!currentUser && roleSelect) {
    return (
      <LoginPage
        role={roleSelect}
        onLogin={handleLogin}
        onBack={() => setRoleSelect(null)}
      />
    )
  }

  // User is logged in
  const isAdmin = currentUser.role === 'ADMIN'

  return (
    <div className="flex">
      <Sidebar currentUser={currentUser} isAdmin={isAdmin} />
      <main className="flex-1 min-h-screen">
        <div className="flex justify-end px-6 pt-4">
          <button
            onClick={handleLogout}
            className="text-xs font-mono text-textSecondary hover:text-textPrimary transition-colors"
          >
            logout
          </button>
        </div>
        <Routes>
          {isAdmin ? (
            <>
              <Route
                path="/"
                element={<AdminDashboard currentUser={currentUser} />}
              />
              <Route
                path="/tickets/:id"
                element={<TicketDetail currentUser={currentUser} isAdmin={true} />}
              />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={<EmployeeDashboard currentUser={currentUser} />}
              />
              <Route
                path="/tickets/:id"
                element={
                  <TicketDetail currentUser={currentUser} isAdmin={false} />
                }
              />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}