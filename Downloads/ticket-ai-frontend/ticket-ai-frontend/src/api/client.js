const BASE_URL = 'http://localhost:8080/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // Auth
  login: (data) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  registerUser: (data) =>
    request('/users/register', { method: 'POST', body: JSON.stringify(data) }),

  getUser: (id) => request(`/users/${id}`),

  // Tickets
  createTicket: (data) =>
    request('/tickets', { method: 'POST', body: JSON.stringify(data) }),

  getTicket: (id) => request(`/tickets/${id}`),

  getAllTickets: (status) =>
    request(`/tickets${status ? `?status=${status}` : ''}`),

  getTicketsByUser: (userId) => request(`/tickets/user/${userId}`),

  updateTicketStatus: (id, status) =>
    request(`/tickets/${id}/status?status=${status}`, { method: 'PATCH' }),

  deleteTicket: (id) => request(`/tickets/${id}`, { method: 'DELETE' }),

  // Messages (admin-employee chat)
  sendMessage: (ticketId, senderId, content) =>
    request(`/messages/tickets/${ticketId}/send?senderId=${senderId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  getTicketMessages: (ticketId) => request(`/messages/tickets/${ticketId}`),
}