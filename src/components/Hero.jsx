import './Hero.css'
import { scrollToSection } from '../utils/scrollToSection'

const assetPath = (folder, file) => `${import.meta.env.BASE_URL}assets/${folder}/${file}`

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">Quan Nguyen · Computer Science</p>
          <h1>Software systems, built for real use.</h1>
          <p className="hero-description">
            Graduate researcher at Texas A&amp;M working across full-stack products, data infrastructure,
            real-time systems, and malware detection.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => scrollToSection('projects')}>
              View work
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => scrollToSection('contact')}>
              Contact
            </button>
          </div>
        </div>

        <div className="hero-gallery" aria-label="Selected project screenshots">
          <figure className="hero-shot hero-shot-primary">
            <img src={assetPath('NexusBase', 'NexusBase1.webp')} alt="NexusBase workspace interface" />
            <figcaption>NexusBase</figcaption>
          </figure>
          <figure className="hero-shot">
            <img src={assetPath('WaveStack', 'WaveStack1.webp')} alt="WaveStack music platform interface" />
            <figcaption>WaveStack</figcaption>
          </figure>
          <figure className="hero-shot">
            <img src={assetPath('AutoStreamYARA', 'AutoStreamYARA1.webp')} alt="AutoStreamYARA research interface" />
            <figcaption>AutoStreamYARA</figcaption>
          </figure>
        </div>

        <dl className="hero-facts" aria-label="Selected facts">
          <div>
            <dt>Research</dt>
            <dd>Texas A&amp;M</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>11 researchers</dd>
          </div>
          <div>
            <dt>VR latency</dt>
            <dd>&lt;35 ms</dd>
          </div>
          <div>
            <dt>LinkedOUT</dt>
            <dd>200+ users</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export default Hero
