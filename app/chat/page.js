'use client'

import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setMessages((msgs) => [...msgs, { role: 'user', content: input }])
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })
    const data = await res.json()
    setMessages((msgs) => [...msgs, { role: 'assistant', content: data.response }])
    setInput('')
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Chat with GPT</h2>
      <div style={{ minHeight: 200, marginBottom: 20, background: '#fafafa', padding: 10, borderRadius: 4 }}>
        {messages.length === 0 && <div style={{ color: '#888' }}>Start the conversation...</div>}
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '10px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ fontWeight: msg.role === 'user' ? 'bold' : 'normal' }}>
              {msg.role === 'user' ? 'You' : 'AI'}:
            </span>{' '}
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{ padding: '0 20px' }}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
} 