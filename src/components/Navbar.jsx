import { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import { scrollToSection } from '../utils/scrollToSection'
import { useActiveSection } from '../hooks/useActiveSection'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const activeSection = useActiveSection()
  const scrollTickingRef = useRef(false)
  const darkSections = new Set(['projects'])
  const isDarkTheme = darkSections.has(activeSection)

  useEffect(() => {
    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 50)
      scrollTickingRef.current = false
    }

    const handleScroll = () => {
      if (scrollTickingRef.current) return

      scrollTickingRef.current = true
      window.requestAnimationFrame(updateScrolled)
    }

    updateScrolled()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      scrollTickingRef.current = false
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navigateTo = (sectionId) => {
    setIsMenuOpen(false)
    scrollToSection(sectionId)
  }

  const navItems = [
    ['home', 'Home'],
    ['about', 'About'],
    ['projects', 'Projects'],
    ['contact', 'Contact']
  ]

  return (
    <nav
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${isDarkTheme ? 'theme-dark' : 'theme-light'} ${isMenuOpen ? 'menu-open' : ''}`}
      aria-label="Primary navigation"
    >
      <div className="navbar-container">
        <button type="button" className="navbar-logo" onClick={() => navigateTo('home')} aria-label="Go to home">
          <span className="logo-text">Quan Nguyen</span>
        </button>

        <button
          type="button"
          className="navbar-menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation-menu"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

        <ul className="navbar-menu" id="primary-navigation-menu">
          {navItems.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? 'active' : ''}
                aria-current={activeSection === id ? 'location' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  navigateTo(id)
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
