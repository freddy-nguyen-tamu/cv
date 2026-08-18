import { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import { scrollToSection } from '../utils/scrollToSection'
import { useActiveSection } from '../hooks/useActiveSection'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const activeSection = useActiveSection()
  const scrollTickingRef = useRef(false)
  const darkSections = new Set(['home', 'projects'])
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

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isDarkTheme ? 'theme-dark' : 'theme-light'}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => scrollToSection('home')}>
          <span className="logo-text">Quan Nguyen</span>
        </div>
        <ul className="navbar-menu">
          <li>
            <a 
              href="#home" 
              className={activeSection === 'home' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('home')
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className={activeSection === 'about' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('about')
              }}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('projects')
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('contact')
              }}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
