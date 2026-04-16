import { useMemo, useRef, useState } from 'react'
import './ChatWidget.css'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Ask me about Quan Nguyen, his projects, background, or experience.'
}

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
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
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
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
    })
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
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'Chat is ready in the UI, but the Vercel endpoint is not configured yet.'
        }
      ])
      scrollToBottom()
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmed,
          context: buildPortfolioContext()
        })
      })

      if (!response.ok) {
        throw new Error('Chat request failed')
      }

      const data = await response.json()
      const answer = data?.answer?.trim() || 'Sorry, I could not find an answer right now.'

      setMessages((current) => [...current, { role: 'assistant', content: answer }])
      scrollToBottom()
    } catch (requestError) {
      setError('Unable to reach the chat service right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="chat-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-panel"
      >
        {isOpen ? 'Close Chat' : 'Ask Quan'}
      </button>

      {isOpen ? (
        <div className="chat-panel" id="portfolio-chat-panel">
          <div className="chat-panel-header">
            <div>
              <p className="chat-kicker">Portfolio Assistant</p>
              <h3>Ask about Quan</h3>
            </div>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message chat-message-${message.role}`}
              >
                <p>{message.content}</p>
              </div>
            ))}
            {isLoading ? (
              <div className="chat-message chat-message-assistant">
                <p>Thinking...</p>
              </div>
            ) : null}
          </div>

          {error ? <p className="chat-error">{error}</p> : null}

          <form className="chat-form" onSubmit={handleSubmit}>
            <textarea
              name="chat"
              rows="2"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about experience, projects, research, or skills"
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export default ChatWidget
