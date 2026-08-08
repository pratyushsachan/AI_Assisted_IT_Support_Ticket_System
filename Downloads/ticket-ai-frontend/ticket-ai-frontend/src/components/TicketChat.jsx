import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function TicketChat({ ticketId, currentUserId, currentUserEmail }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [ticketId])

  async function loadMessages() {
    try {
      const data = await api.getTicketMessages(ticketId)
      setMessages(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await api.sendMessage(ticketId, currentUserId, newMessage)
      setNewMessage('')
      await loadMessages()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="border-t border-border pt-5 mt-5">
      <p className="text-xs font-mono text-textSecondary mb-3">Messages</p>

      {loading && (
        <p className="text-xs text-textSecondary font-mono">Loading messages…</p>
      )}

      {error && (
        <p className="text-xs text-danger font-mono mb-3">{error}</p>
      )}

      <div className="bg-base border border-border rounded-lg p-3 mb-3 max-h-48 overflow-y-auto space-y-2">
        {messages.length === 0 && !loading && (
          <p className="text-xs text-textSecondary font-mono">No messages yet</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="text-xs">
            <p className="text-textSecondary font-mono mb-0.5">
              {msg.senderEmail}
            </p>
            <p className="text-textPrimary">{msg.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-base border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
        />
        <button
          type="submit"
          className="bg-teal text-base font-semibold text-sm px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </form>
    </div>
  )
}