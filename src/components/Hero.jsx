import { useEffect, useState } from 'react'
import './Hero.css'
import { scrollToSection } from '../utils/scrollToSection'

const assetPath = (file) => `${import.meta.env.BASE_URL}assets/system-core/${file}`

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="home" className="hero">
      <div className="hero-ambient hero-ambient-one" aria-hidden="true"></div>
      <div className="hero-ambient hero-ambient-two" aria-hidden="true"></div>

      <div className="container hero-layout">
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <p className="hero-kicker"><span>Systems / Data / Security</span><span>2026</span></p>

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

        <div className="hero-art" aria-label="Animated systems core visualization">
          <div className="hero-art-frame">
            <img className="hero-art-poster" src={assetPath('core-poster.webp')} alt="" aria-hidden="true" />
            <video
              className="hero-core-video"
              src={assetPath('core-idle.mp4')}
              poster={assetPath('core-poster.webp')}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
            <div className="hero-art-glass" aria-hidden="true"></div>
            <div className="hero-art-corner hero-art-corner-tl" aria-hidden="true"></div>
            <div className="hero-art-corner hero-art-corner-br" aria-hidden="true"></div>
            <div className="hero-art-label" aria-hidden="true">
              <span>Compute core / idle</span>
              <span>Scroll to activate ↓</span>
            </div>
          </div>

          <div className="hero-art-note">
            <span>CS · Texas A&amp;M</span>
            <span>College Station, TX</span>
          </div>

          <div className="hero-floating-tag hero-floating-tag-one" aria-hidden="true">
            <span>Realtime</span><strong>35ms</strong>
          </div>
          <div className="hero-floating-tag hero-floating-tag-two" aria-hidden="true">
            <span>Research</span><strong>Active</strong>
          </div>
        </div>
      </div>

      <button type="button" className="scroll-down-button" onClick={() => scrollToSection('system-sequence')} aria-label="Scroll to interactive systems sequence">
        <span>Activate core</span>
      </button>
    </section>
  )
}

export default Hero
