import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import './Projects.css'

const AUTO_SCROLL_INTERVAL = 2000
const PREVIEW_CHECK_TIMEOUT = 4500
const assetPath = (folder, file) => `${import.meta.env.BASE_URL}assets/${folder}/${file}`
const imageNumbers = (count) => Array.from({ length: count }, (_, index) => index + 1)
const projectImages = (folder, prefix, order) =>
  order.map((number) => assetPath(folder, `${prefix}${number}.png`))
const hostingProviders = [
  { match: 'herokuapp.com', label: 'Heroku' },
  { match: 'vercel.app', label: 'Vercel' },
  { match: 'duckdns.org', label: 'Duck DNS' },
  { match: 'pages.dev', label: 'Cloudflare Pages' },
  { match: 'netlify.app', label: 'Netlify' },
  { match: 'github.io', label: 'GitHub Pages' },
  { match: 'render.com', label: 'Render' }
]

const titleCase = (value) =>
  value
    .split(/[-.\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const getHostingSource = (url) => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    const provider = hostingProviders.find(({ match }) => hostname === match || hostname.endsWith(`.${match}`))

    if (provider) return provider.label

    const labels = hostname.split('.').filter(Boolean)
    const source = labels.length > 1 ? labels[labels.length - 2] : labels[0]

    return titleCase(source || hostname)
  } catch {
    return 'The host'
  }
}

const openPreviewSite = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function ProjectCard({ project, index, onOpen }) {
  const [previewIndex, setPreviewIndex] = useState(0)

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.15
  })

  const lastAdvanceRef = useRef(Date.now())
  const scrollTickingRef = useRef(false)

  useEffect(() => {
    if (!project.images || project.images.length <= 1) return
    if (!inView) return

    const advanceSlide = () => {
      setPreviewIndex((prev) => (prev + 1) % project.images.length)
      lastAdvanceRef.current = Date.now()
    }

    const tryAdvanceFromTime = () => {
      const now = Date.now()
      const elapsed = now - lastAdvanceRef.current

      if (elapsed >= AUTO_SCROLL_INTERVAL) {
        const steps = Math.floor(elapsed / AUTO_SCROLL_INTERVAL)

        setPreviewIndex((prev) => (prev + steps) % project.images.length)
        lastAdvanceRef.current += steps * AUTO_SCROLL_INTERVAL
      }
    }

    const intervalId = window.setInterval(() => {
      tryAdvanceFromTime()
    }, 250)

    const handleScroll = () => {
      if (scrollTickingRef.current) return

      scrollTickingRef.current = true

      window.requestAnimationFrame(() => {
        tryAdvanceFromTime()
        scrollTickingRef.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true })

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
      scrollTickingRef.current = false
    }
  }, [inView, project.images])

  const showPreviewDots = project.images.length > 1 && project.images.length <= 12

  return (
    <div
      ref={ref}
      className={`project-card ${inView ? 'visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onOpen(project, previewIndex)}
    >
      <div className="project-image">
        <div
          className="image-slider"
          style={{ transform: `translateX(-${previewIndex * 100}%)` }}
        >
          {project.images.map((img, imgIndex) => (
            <img
              key={`${project.id}-${imgIndex}`}
              src={img}
              alt={`${project.title} screenshot ${imgIndex + 1}`}
              className="slider-image"
            />
          ))}
        </div>

        {showPreviewDots && (
          <div className="preview-dots">
            {project.images.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`preview-dot ${dotIndex === previewIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        )}

        {!showPreviewDots && project.images.length > 1 && (
          <span className="preview-count">{previewIndex + 1} / {project.images.length}</span>
        )}

        <div className="project-overlay">
          <span className="view-details">View Details</span>
        </div>
      </div>

      <div className="project-info">
        <span className="project-category">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-technologies">
          {project.technologies.slice(0, 6).map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function LivePreview({ project }) {
  const [previewState, setPreviewState] = useState(
    project.previewFrameFallback ? 'blocked' : 'checking'
  )
  const [sourceLabel, setSourceLabel] = useState(getHostingSource(project.previewUrl))
  const previewFrameRef = useRef(null)
  const previewClickLayerRef = useRef(null)
  const previewPassthroughTimerRef = useRef(null)
  const previewGestureRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    moved: false
  })

  useEffect(() => {
    if (!project.previewUrl) return

    let cancelled = false
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      if (!cancelled) setPreviewState((current) => (current === 'checking' ? 'ready' : current))
      controller.abort()
    }, PREVIEW_CHECK_TIMEOUT)

    setSourceLabel(getHostingSource(project.previewUrl))
    setPreviewState(project.previewFrameFallback ? 'blocked' : 'checking')

    if (project.previewFrameFallback) {
      window.clearTimeout(timeoutId)
      return () => {
        cancelled = true
        controller.abort()
      }
    }

    fetch(`/api/frame-check?url=${encodeURIComponent(project.previewUrl)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to check frame policy')
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        if (data?.sourceLabel) setSourceLabel(data.sourceLabel)
        setPreviewState(data?.blocked ? 'blocked' : 'ready')
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewState((current) => (current === 'checking' ? 'ready' : current))
        }
      })
      .finally(() => {
        window.clearTimeout(timeoutId)
      })

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [project.previewFrameFallback, project.previewUrl])

  useEffect(() => {
    return () => {
      window.clearTimeout(previewPassthroughTimerRef.current)
    }
  }, [])

  const restorePreviewClickLayer = () => {
    previewClickLayerRef.current?.classList.remove('is-wheel-passthrough')
  }
  const releasePreviewClickLayer = (duration = 1600) => {
    window.clearTimeout(previewPassthroughTimerRef.current)
    previewClickLayerRef.current?.classList.add('is-wheel-passthrough')
    previewFrameRef.current?.focus?.()
    previewPassthroughTimerRef.current = window.setTimeout(restorePreviewClickLayer, duration)
  }
  const openSite = () => openPreviewSite(project.previewUrl)
  const handlePreviewWheel = (event) => {
    event.preventDefault()
    event.stopPropagation()
    releasePreviewClickLayer()
  }
  const handlePreviewPointerDown = (event) => {
    previewGestureRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false
    }
  }
  const handlePreviewPointerMove = (event) => {
    const gesture = previewGestureRef.current

    if (!gesture.active || gesture.pointerId !== event.pointerId) return

    const totalX = event.clientX - gesture.startX
    const totalY = event.clientY - gesture.startY

    if (Math.abs(totalX) > 6 || Math.abs(totalY) > 6) {
      gesture.moved = true
    }

    gesture.lastX = event.clientX
    gesture.lastY = event.clientY

    if (event.pointerType !== 'mouse' && Math.abs(totalY) > Math.abs(totalX)) {
      releasePreviewClickLayer(1600)
    }
  }
  const handlePreviewPointerEnd = (event) => {
    if (previewGestureRef.current.pointerId === event.pointerId) {
      previewGestureRef.current.active = false
    }
  }
  const handlePreviewClick = (event) => {
    if (previewGestureRef.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    openSite()
  }

  if (previewState === 'blocked') {
    return (
      <button
        type="button"
        className="live-preview-fallback"
        onClick={openSite}
        aria-label={`Open ${project.title} in a new tab`}
      >
        <span className="live-preview-fallback-text">
          {sourceLabel} changed their embedded iframe policy, so this preview could not render here.
          Please visit the website at <span className="live-preview-url">{project.previewUrl}</span>.
        </span>
      </button>
    )
  }

  return (
    <div className="live-preview-viewport">
      {previewState === 'checking' && (
        <span className="live-preview-status">Checking embed access</span>
      )}
      <div className="live-preview-surface">
        <iframe
          ref={previewFrameRef}
          title={`${project.title} live preview`}
          src={project.previewUrl}
          className="live-preview-frame"
          allow="autoplay; clipboard-read; clipboard-write; fullscreen; payment; web-share"
          loading="lazy"
          tabIndex={-1}
          referrerPolicy="strict-origin-when-cross-origin"
          onError={() => setPreviewState('blocked')}
        />
        <button
          ref={previewClickLayerRef}
          type="button"
          className="live-preview-click-layer"
          onWheel={handlePreviewWheel}
          onPointerDown={handlePreviewPointerDown}
          onPointerMove={handlePreviewPointerMove}
          onPointerUp={handlePreviewPointerEnd}
          onPointerCancel={handlePreviewPointerEnd}
          onClick={handlePreviewClick}
          aria-label={`Open ${project.title} in a new tab`}
        />
      </div>
    </div>
  )
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [fullscreenImage, setFullscreenImage] = useState(null)

  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const projects = [
    {
      id: 'linkedout',
      title: 'LinkedOUT',
      category: 'Full-Stack / Platform Engineering',
      description:
        'A professional networking platform for Texas A&M students and alumni with verified referrals, messaging, and profile management.',
      highlights: [
        'Led a 4-person team building secure company email verification and referral workflows',
        'Implemented real-time messaging and role-based access control',
        'Supported 200+ active users with production deployment and full testing coverage'
      ],
      technologies: [
        'Ruby on Rails',
        'PostgreSQL',
        'JavaScript',
        'HTML5',
        'CSS3',
        'Bootstrap 5',
        'Stimulus.js',
        'Turbo',
        'Docker',
        'Heroku'
      ],
      images: projectImages('LinkedOUT', 'LinkedOUT', imageNumbers(6)),
      link: 'https://linkedout-aggies-0f3d429fef3a.herokuapp.com/',
      previewUrl: 'https://linkedout-aggies-0f3d429fef3a.herokuapp.com/',
      previewFrameFallback: true,
      github: 'https://github.com/Project-3-Group-3-CSCE-606/Project-3'
    },
    {
      id: 'nexusbase',
      title: 'NexusBase',
      category: 'Full-Stack / Operations Platform',
      description:
        'A full-stack collaborative workspace SaaS combining project/task workflows, private cloud file storage, team messaging, notifications, audit logs, admin analytics, and project health tracking.',
      highlights: [
        'Implemented Auth.js Google OAuth, protected API routes, project membership roles, and role-aware file-sharing permissions',
        'Modeled users, profiles, projects, members, tasks, comments, cloud files, notifications, activity logs, channels, messages, milestones, decisions, and project risks in Prisma/PostgreSQL',
        'Built a responsive dashboard with drag-and-drop Kanban tasks, S3 presigned upload architecture, workspace search, command palette, project health center, and admin analytics'
      ],
      technologies: [
        'Next.js',
        'React 19',
        'TypeScript',
        'Tailwind CSS',
        'Auth.js',
        'Google OAuth',
        'Prisma',
        'PostgreSQL',
        'AWS S3',
        'Vercel',
        'Zod',
        'Framer Motion'
      ],
      images: projectImages('NexusBase', 'NexusBase', imageNumbers(27)),
      link: 'https://nexus-base-kohl.vercel.app/',
      previewUrl: 'https://nexus-base-kohl.vercel.app/',
      github: 'https://github.com/freddy-nguyen-tamu/NexusBase'
    },
    {
      id: 'wavestack',
      title: 'WaveStack',
      category: 'Cloud-Native / Music Platform',
      description:
        'A cloud-native music streaming platform with playback workflows, playlists, search, upload processing, signed streaming URLs, graph recommendations, analytics, and Azure-ready infrastructure.',
      highlights: [
        'Structured a multi-service architecture with a React/Vite music UI, NestJS GraphQL gateway, PostgreSQL system of record, Neo4j relationship graph, RabbitMQ job bus, FastAPI audio AI service, and .NET analytics service',
        'Planned and wired platform capabilities for playback history, favorites, playlists, search, recommendations, audio processing jobs, waveform generation, signed URLs, and admin reports',
        'Added Docker Compose, service Dockerfiles, Caddy, Azure VM guidance, and Bicep/Kubernetes infrastructure for repeatable local and cloud-oriented deployment paths'
      ],
      technologies: [
        'React',
        'TypeScript',
        'Vite',
        'NestJS',
        'GraphQL',
        'PostgreSQL',
        'Neo4j',
        'RabbitMQ',
        'FastAPI',
        'Python',
        '.NET',
        'Docker',
        'Kubernetes',
        'Azure Bicep',
        'Caddy',
        'Azure'
      ],
      images: projectImages('WaveStack', 'WaveStack', imageNumbers(30)),
      link: 'https://wavestack.duckdns.org/all',
      previewUrl: 'https://wavestack.duckdns.org/all',
      github: 'https://github.com/freddy-nguyen-tamu/WaveStack'
    },
    {
      id: 'aivising',
      title: 'AIvising',
      category: 'AI / Full-Stack / UI-UX',
      description:
        'An AI-assisted advising and knowledge-retrieval platform that pairs a polished chat experience with grounded answers, conversation history, feedback capture, and an admin control center for maintaining policy content.',
      highlights: [
        'Built a UI/UX-focused React + TypeScript experience with multi-conversation chat, role-aware member/admin workflows, and feedback collection',
        'Implemented a FastAPI retrieval layer that ranks document chunks, preserves six-turn conversation context, and surfaces top-4 citations alongside every answer',
        'Streamlined content operations with document ingestion and analytics tooling, enabling faster iteration and an estimated ~60% reduction in repeat policy lookup time during prototype workflows'
      ],
      technologies: [
        'React',
        'TypeScript',
        'Vite',
        'FastAPI',
        'Python',
        'Retrieval-Augmented Generation',
        'Prompt Engineering',
        'Groq API',
        'Admin Analytics',
        'UI/UX Design'
      ],
      images: [
        ...projectImages('AIvising', 'AIvising', [10, 1, 2, 4, 3, 9, 6, 8, 5, 7])
      ],
      link: '#',
      github: 'https://github.com/freddy-nguyen-tamu/AIvising'
    },
    {
      id: 'autostreamyara',
      title: 'AutoStreamYARA',
      category: 'Security / Research Systems',
      description:
        'A research system for automatically generating YARA rules for real-time detection of evolving malware families from external threat feeds.',
      highlights: [
        'Guided a team of 11 on scalable rule-generation pipeline design',
        'Improved malware detection accuracy by ~18%',
        'Reduced rule generation latency by ~25%'
      ],
      technologies: ['Python', 'YARA', 'Machine Learning', 'Streaming Classification'],
      images: projectImages('AutoStreamYARA', 'AutoStreamYARA', imageNumbers(4)),
      link: '#',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 'lpc',
      title: 'LPC',
      category: 'Data Systems / Full-Stack',
      description:
        'A cross-platform data transfer and management system for large-scale file datasets, with scalable data pipelines, structured data processing, and visualization of transfer states.',
      highlights: [
        'Built chunk-based processing workflows for 100MB+ datasets',
        'Implemented SHA-256 integrity validation and modular ETL-style Python workflows',
        'Reduced transfer failures by ~30% with real-time monitoring dashboards'
      ],
      technologies: [
        'Python',
        'Flask',
        'Kotlin',
        'Android Jetpack',
        'SQLite',
        'REST APIs',
        'JSON',
        'Docker',
        'Socket.IO',
        'SHA-256',
        'Fernet'
      ],
      images: projectImages('LPC', 'LPC', [2, 1, 3]),
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 'taskmage',
      title: 'TaskMage',
      category: 'Full-Stack / Real-Time Collaboration',
      description:
        'A project management platform with authenticated workflows, real-time Kanban boards, role-based access, and optimistic UI updates.',
      highlights: [
        'Built REST APIs, permissions, JWT auth, drag-and-drop boards, and real-time task updates',
        'Designed schema and tests for containerized full-stack deployment',
        'Achieved consistent sub-20ms board update latency under simultaneous multi-user interaction'
      ],
      technologies: [
        'React',
        'Redux Toolkit',
        'React Query',
        'Node.js',
        'Express',
        'Socket.IO',
        'PostgreSQL',
        'Prisma ORM',
        'Tailwind CSS',
        'Docker'
      ],
      images: projectImages('TaskMage', 'TaskMage', imageNumbers(7)),
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    }
  ]

  const showModalDots =
    selectedProject?.images.length > 1 && selectedProject.images.length <= 18

  const openModal = (project, imageIndex = 0) => {
    setSelectedProject(project)
    setModalImageIndex(imageIndex)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProject(null)
    setModalImageIndex(0)
    setFullscreenImage(null)
    document.body.style.overflow = 'unset'
  }

  const openFullscreenImage = () => {
    if (!selectedProject) return
    setFullscreenImage({
      src: selectedProject.images[modalImageIndex],
      alt: `${selectedProject.title} screenshot ${modalImageIndex + 1}`
    })
  }

  const closeFullscreenImage = () => {
    setFullscreenImage(null)
  }

  const showPrevImage = () => {
    if (!selectedProject) return
    setModalImageIndex((prev) =>
      prev === 0 ? selectedProject.images.length - 1 : prev - 1
    )
  }

  const showNextImage = () => {
    if (!selectedProject) return
    setModalImageIndex((prev) =>
      prev === selectedProject.images.length - 1 ? 0 : prev + 1
    )
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) return

      if (fullscreenImage && e.key === 'Escape') {
        closeFullscreenImage()
        return
      }

      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') showPrevImage()
      if (e.key === 'ArrowRight') showNextImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject, fullscreenImage])

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div ref={titleRef} className={`section-title ${titleInView ? 'visible' : ''}`}>
          <p className="section-subtitle">Selected Work</p>
          <h2>Projects & Research</h2>
          <div className="title-underline"></div>
          <p className="projects-intro">
            Selected work across AI-assisted products, scalable systems, security research, and full-stack application development
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={openModal}
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="project-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>

            <div className="modal-image-wrapper">
              {selectedProject.images.length > 1 && (
                <>
                  <button
                    className="modal-nav modal-nav-left"
                    onClick={showPrevImage}
                    aria-label="Previous image"
                  >
                    &#10094;
                  </button>

                  <button
                    className="modal-nav modal-nav-right"
                    onClick={showNextImage}
                    aria-label="Next image"
                  >
                    &#10095;
                  </button>
                </>
              )}

              <div className="modal-image">
                <img
                  key={`${selectedProject.id}-${modalImageIndex}`}
                  src={selectedProject.images[modalImageIndex]}
                  alt={`${selectedProject.title} screenshot ${modalImageIndex + 1}`}
                  className="modal-image-display"
                />
                <button
                  type="button"
                  className="modal-expand"
                  onClick={openFullscreenImage}
                  aria-label="View image full screen"
                >
                  Full Screen
                </button>
              </div>

              {showModalDots && (
                <div className="modal-dots">
                  {selectedProject.images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`modal-dot ${idx === modalImageIndex ? 'active' : ''}`}
                      onClick={() => setModalImageIndex(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {!showModalDots && selectedProject.images.length > 1 && (
                <div className="modal-image-count">
                  {modalImageIndex + 1} / {selectedProject.images.length}
                </div>
              )}
            </div>

            {selectedProject.previewUrl && (
              <div className="live-preview-panel">
                <div className="live-preview-toolbar">
                  <div className="live-preview-title">
                    <span className="live-preview-light"></span>
                    <span>Live Preview</span>
                  </div>
                  <a
                    href={selectedProject.previewUrl}
                    className="live-preview-open"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Full Site
                  </a>
                </div>
                <LivePreview project={selectedProject} />
              </div>
            )}

            <div className="modal-info">
              <span className="project-category">{selectedProject.category}</span>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '12px' }}>Key Impact</h3>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--text-light)' }}>
                  {selectedProject.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="project-technologies">
                {selectedProject.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>

              <div className="project-links">
                {selectedProject.link !== '#' && (
                  <a
                    href={selectedProject.link}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo
                  </a>
                )}
                <a
                  href={selectedProject.github}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Code
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {fullscreenImage && (
        <div className="fullscreen-image-modal" onClick={closeFullscreenImage}>
          <button
            type="button"
            className="fullscreen-image-close"
            onClick={closeFullscreenImage}
            aria-label="Close full screen image"
          >
            &times;
          </button>
          <img
            src={fullscreenImage.src}
            alt={fullscreenImage.alt}
            className="fullscreen-image-display"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

export default Projects
