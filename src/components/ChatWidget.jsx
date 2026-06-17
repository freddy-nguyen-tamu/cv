import { useEffect, useMemo, useRef, useState } from 'react'
import './ChatWidget.css'
import wavingBotGif from '../../waving-bot.gif'
import insideChatbotGif from '../../inside-chatbot.gif'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Ask me about Quan Nguyen, his projects, background, or experience.'
}
const MAX_HISTORY_MESSAGES = 10
const INTRO_MESSAGE = "Hi, I am Quan Nguyen's Portfolio Assistant, ask me anything about his projects, background, or experience."

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
  const [activeSection, setActiveSection] = useState('home')
  const [showIntroBubble, setShowIntroBubble] = useState(true)
  const [introText, setIntroText] = useState('')
  const [introPlayed, setIntroPlayed] = useState(false)
  const listRef = useRef(null)

  const isConfigured = useMemo(() => Boolean(endpoint), [endpoint])
  const darkSections = useMemo(() => new Set(['home', 'projects']), [])
  const themeClass = darkSections.has(activeSection) ? 'theme-dark' : 'theme-light'
  const gifFilter = darkSections.has(activeSection) ? 'none' : 'invert(1) hue-rotate(180deg)'

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact']
      const current = sections.find((section) => {
        const element = document.getElementById(section)
        if (!element) return false

        const rect = element.getBoundingClientRect()
        return rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35
      })

      if (current) {
        setActiveSection(current)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isOpen || introPlayed || !showIntroBubble) return

    let typingTimeout
    let hideTimeout

    if (introText.length < INTRO_MESSAGE.length) {
      typingTimeout = window.setTimeout(() => {
        setIntroText(INTRO_MESSAGE.slice(0, introText.length + 1))
      }, 32)
    } else {
      hideTimeout = window.setTimeout(() => {
        setShowIntroBubble(false)
        setIntroPlayed(true)
      }, 2200)
    }

    return () => {
      window.clearTimeout(typingTimeout)
      window.clearTimeout(hideTimeout)
    }
  }, [introPlayed, introText, isOpen, showIntroBubble])

  useEffect(() => {
    if (!isOpen) return

    setShowIntroBubble(false)
    setIntroPlayed(true)
  }, [isOpen])

  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
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
          context: buildPortfolioContext(),
          history: nextMessages
            .filter((entry) => entry !== INITIAL_MESSAGE)
            .slice(-MAX_HISTORY_MESSAGES)
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
    <div
      className={`chat-widget ${isOpen ? 'open' : ''} ${themeClass}`}
      style={{ '--chat-gif-filter': gifFilter }}
    >
      {isOpen ? (
        <>
          <img
            src={insideChatbotGif}
            alt=""
            aria-hidden="true"
            className="chat-open-indicator"
            width="84"
            height="84"
          />
          <div className="chat-panel" id="portfolio-chat-panel">
            <div className="chat-panel-header">
              <div>
                <p className="chat-kicker">Portfolio Assistant</p>
                <h3>Ask about Quan</h3>
              </div>
              <div className="chat-panel-actions">
                <button type="button" className="chat-panel-button" onClick={resetConversation}>
                  New Chat
                </button>
                <button
                  type="button"
                  className="chat-panel-button"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
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
        </>
      ) : (
        <>
          {showIntroBubble ? (
            <div className="chat-intro-bubble" aria-hidden="true">
              <p>{introText}</p>
            </div>
          ) : null}
          <button
            type="button"
            className="chat-toggle"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="portfolio-chat-panel"
            aria-label="Open chat"
          >
            <img
              src={wavingBotGif}
              alt=""
              aria-hidden="true"
              className="chat-toggle-image"
              width="68"
              height="68"
            />
          </button>
        </>
      )}
    </div>
  )
}

export default ChatWidget
