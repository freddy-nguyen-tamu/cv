import { useEffect, useState } from 'react'
import './Hero.css'

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  const words = ['Quan Nguyen', 'Full-Stack Developer', 'Graduate Student', 'Data Systems Builder']
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const currentWord = words[wordIndex]
    let timeout

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1))
        }, 120)
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 1400)
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1))
        }, 60)
      } else {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex])

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="hero">
      <div
        className="hero-background"
        style={{
          transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
        }}
      />

      <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
        <h1 className="hero-title">
          <span className="title-line">Hi, I'm</span>
          <span className="title-name">
            <span className="typed-text">{text}</span>
          </span>
        </h1>

        <p
          style={{
            maxWidth: '760px',
            margin: '0 auto 32px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.05rem'
          }}
        >
          I build scalable software systems across full-stack applications, structured data workflows,
          real-time platforms, and security-focused research. My recent work spans malware detection
          pipelines, large-scale file transfer systems, and production-style web platforms.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={scrollToProjects}>
            View Projects
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Me
          </button>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero