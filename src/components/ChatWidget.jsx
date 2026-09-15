import { useMemo, useRef, useState } from 'react'
import './ChatWidget.css'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "I can answer questions about Quan's projects, research, education, and experience."
}
const MAX_HISTORY_MESSAGES = 10

function collectSectionText(sectionId) {
  const element = document.getElementById(sectionId)
  if (!element) return ''

  return Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, p, li, span, a'))
    .map((node) => node.textContent?.trim() || '')
    .filter(Boolean)
    .join('\n')
}

function buildPortfolioContext() {
  const sections = [
    { label: 'Home', id: 'home' },
    { label: 'Work', id: 'projects' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ]

  return sections
    .map(({ label, id }) => {
      const text = collectSectionText(id)
      return text ? `${label}\n${text}` : ''
    })
    .filter(Boolean)
    .join('\n\n')
    .slice(0, 12000)
}

const ChatWidget = () => {
  const endpoint = import.meta.env.VITE_CHAT_API_URL
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)
  const isConfigured = useMemo(() => Boolean(endpoint), [endpoint])

  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    })
  }

  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE])
    setInput('')
    setError('')
    setIsLoading(false)
    scrollToBottom()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const nextUserMessage = { role: 'user', content: trimmed }
    const nextMessages = [...messages, nextUserMessage]

    setMessages(nextMessages)
    setInput('')
    setError('')
    scrollToBottom()

    if (!isConfigured) {
      setMessages([...nextMessages, { role: 'assistant', content: 'The chat endpoint is not configured.' }])
      scrollToBottom()
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          context: buildPortfolioContext(),
          history: nextMessages.filter((entry) => entry !== INITIAL_MESSAGE).slice(-MAX_HISTORY_MESSAGES)
        })
      })

      if (!response.ok) throw new Error('Chat request failed')

      const data = await response.json()
      const answer = data?.answer?.trim() || 'I could not find an answer to that.'
      setMessages((current) => [...current, { role: 'assistant', content: answer }])
      scrollToBottom()
    } catch {
      setError('Chat is unavailable right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className="chat-panel" id="portfolio-chat-panel" role="dialog" aria-label="Portfolio assistant">
          <header className="chat-panel-header">
            <div>
              <p>Portfolio assistant</p>
              <h3>Ask about the work</h3>
            </div>
            <div className="chat-panel-actions">
              <button type="button" onClick={resetConversation}>Reset</button>
              <button type="button" onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </header>

          <div className="chat-messages" ref={listRef} aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-message chat-message-${message.role}`}>
                <p>{message.content}</p>
              </div>
            ))}
            {isLoading ? <div className="chat-message chat-message-assistant"><p>Thinking…</p></div> : null}
          </div>

          {error ? <p className="chat-error" role="alert">{error}</p> : null}

          <form className="chat-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="portfolio-chat-input">Message</label>
            <textarea
              id="portfolio-chat-input"
              name="chat"
              rows="2"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about a project or role"
            />
            <button type="submit" disabled={isLoading || !input.trim()}>Send</button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          className="chat-toggle"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="portfolio-chat-panel"
        >
          Ask portfolio
        </button>
      )}
    </div>
  )
}

export default ChatWidget
