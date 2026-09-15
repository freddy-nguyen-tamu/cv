import { useEffect, useRef, useState } from 'react'
import './SystemSequence.css'

const assetPath = (file) => `${import.meta.env.BASE_URL}assets/system-core/${file}`
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

const SystemSequence = () => {
  const sectionRef = useRef(null)
  const landVideoRef = useRef(null)
  const loadVideoRef = useRef(null)
  const rafRef = useRef(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const landVideo = landVideoRef.current
    const loadVideo = loadVideoRef.current

    if (!section || !landVideo || !loadVideo) return undefined

    let previousStep = -1
    let reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const seekVideo = (video, progress) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      const nextTime = clamp(progress) * Math.max(0, video.duration - 0.02)

      if (Math.abs(video.currentTime - nextTime) > 0.018) {
        video.currentTime = nextTime
      }
    }

    const update = () => {
      rafRef.current = 0

      const rect = section.getBoundingClientRect()
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = reduceMotion ? 1 : clamp(-rect.top / scrollRange)
      const firstProgress = clamp(progress / 0.5)
      const secondProgress = clamp((progress - 0.5) / 0.5)
      const secondOpacity = clamp((progress - 0.485) / 0.03)
      const step = progress < 0.3 ? 0 : progress < 0.68 ? 1 : 2

      section.style.setProperty('--sequence-progress', progress.toFixed(4))
      section.style.setProperty('--sequence-second-opacity', secondOpacity.toFixed(4))
      section.style.setProperty('--sequence-first-opacity', (1 - secondOpacity).toFixed(4))
      section.style.setProperty('--sequence-depth', `${Math.round(progress * 100)}%`)

      seekVideo(landVideo, firstProgress)
      seekVideo(loadVideo, secondProgress)

      if (step !== previousStep) {
        previousStep = step
        setActiveStep(step)
      }
    }

    const queueUpdate = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(update)
    }

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const handleMotionPreference = (event) => {
      reduceMotion = event.matches
      queueUpdate()
    }

    landVideo.addEventListener('loadedmetadata', queueUpdate)
    loadVideo.addEventListener('loadedmetadata', queueUpdate)
    mediaQuery?.addEventListener?.('change', handleMotionPreference)
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)
    update()

    return () => {
      window.cancelAnimationFrame(rafRef.current)
      landVideo.removeEventListener('loadedmetadata', queueUpdate)
      loadVideo.removeEventListener('loadedmetadata', queueUpdate)
      mediaQuery?.removeEventListener?.('change', handleMotionPreference)
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
    }
  }, [])

  const steps = [
    {
      number: '01',
      eyebrow: 'Observe',
      title: 'Systems start as signals.',
      body: 'A floating compute core maps the layers I work across: data, product surfaces, infrastructure, and security.'
    },
    {
      number: '02',
      eyebrow: 'Stabilize',
      title: 'Then they touch reality.',
      body: 'The chamber lands, absorbs impact, and opens—the point where architecture has to become measurable behavior.'
    },
    {
      number: '03',
      eyebrow: 'Integrate',
      title: 'The pieces become one system.',
      body: 'Independent modules arrive, align, and dock into a working whole: the same systems mindset behind my research and full-stack work.'
    }
  ]

  return (
    <section ref={sectionRef} id="system-sequence" className="system-sequence" aria-label="Interactive systems sequence">
      <div className="system-sequence-sticky">
        <div className="system-sequence-grid" aria-hidden="true"></div>
        <div className="system-sequence-orbit system-sequence-orbit-a" aria-hidden="true"></div>
        <div className="system-sequence-orbit system-sequence-orbit-b" aria-hidden="true"></div>

        <div className="system-sequence-stage">
          <div className="system-sequence-media" aria-hidden="true">
            <img
              className="system-sequence-poster"
              src={assetPath('core-poster.webp')}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <video
              ref={landVideoRef}
              className="system-sequence-video system-sequence-video-land"
              src={assetPath('core-land.mp4')}
              muted
              playsInline
              preload="auto"
              poster={assetPath('core-poster.webp')}
            />
            <video
              ref={loadVideoRef}
              className="system-sequence-video system-sequence-video-load"
              src={assetPath('core-load.mp4')}
              muted
              playsInline
              preload="auto"
            />
            <div className="system-sequence-glass"></div>
          </div>

          <div className="system-sequence-copy">
            <div className="system-sequence-kicker">
              <span>Interactive object study</span>
              <span className="system-sequence-depth">Scroll {`//`} {activeStep + 1}/3</span>
            </div>

            <div className="system-sequence-steps">
              {steps.map((step, index) => (
                <article
                  key={step.number}
                  className={`system-sequence-step ${activeStep === index ? 'active' : ''}`}
                  aria-current={activeStep === index ? 'step' : undefined}
                >
                  <div className="system-sequence-step-meta">
                    <span>{step.number}</span>
                    <span>{step.eyebrow}</span>
                  </div>
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="system-sequence-rail" aria-hidden="true">
          <span className="system-sequence-rail-fill"></span>
        </div>
      </div>
    </section>
  )
}

export default SystemSequence
