import { useEffect, useState } from 'react'
import './Hero.css'
import avatarImage from './assets/avatar1.webp'
import { scrollToSection } from '../utils/scrollToSection'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="home" className="hero">
      <div className="container hero-layout">
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <h1 className="hero-title">
            <span className="title-line">Systems engineer · researcher</span>
            <span className="title-name">Quan Nguyen</span>
          </h1>

          <p className="hero-description">
            I build scalable software systems across full-stack products, structured data workflows,
            real-time platforms, and security-focused research.
          </p>

          <div className="hero-buttons">
            <button type="button" className="btn btn-primary" onClick={() => scrollToSection('projects')}>
              View selected work
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => scrollToSection('contact')}>
              Get in touch
            </button>
          </div>

          <div className="hero-proof" aria-label="Selected outcomes">
            <div>
              <strong>11</strong>
              <span>research team</span>
            </div>
            <div>
              <strong>&lt;35ms</strong>
              <span>VR pipeline latency</span>
            </div>
            <div>
              <strong>200+</strong>
              <span>platform users</span>
            </div>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-frame">
            <img src={avatarImage} alt="" className="hero-avatar" decoding="async" fetchPriority="high" />
          </div>
          <div className="hero-art-note">
            <span>CS · Texas A&amp;M</span>
            <span>College Station, TX</span>
          </div>
        </div>
      </div>

      <button type="button" className="scroll-down-button" onClick={() => scrollToSection('about')} aria-label="Scroll to About Me">
        <span>Scroll</span>
      </button>
    </section>
  )
}

export default Hero
