import { useEffect, useMemo, useState } from 'react'
import './Projects.css'

const PREVIEW_CHECK_TIMEOUT = 4500
const assetPath = (folder, file) => `${import.meta.env.BASE_URL}assets/${folder}/${file}`
const imageNumbers = (count) => Array.from({ length: count }, (_, index) => index + 1)
const projectImages = (folder, prefix, order) =>
  order.map((number) => assetPath(folder, `${prefix}${number}.webp`))

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
    return 'This host'
  }
}

const shouldCheckFramePolicy = () => {
  if (typeof window === 'undefined') return false
  return !new Set(['localhost', '127.0.0.1', 'freddy-nguyen-tamu.github.io']).has(window.location.hostname)
}

function ProjectCard({ project, onOpen }) {
  return (
    <article
      className="project-card"
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} project details`}
      onClick={() => onOpen(project)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(project)
        }
      }}
    >
      <div className="project-image">
        <img
          src={project.images[0]}
          alt={`${project.title} interface`}
          loading="lazy"
          decoding="async"
        />
        <span className="project-image-count">{project.images.length} images</span>
      </div>

      <div className="project-info">
        <p className="project-category">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <p className="project-stack">{project.technologies.slice(0, 4).join(' · ')}</p>
      </div>
    </article>
  )
}

function LivePreview({ project }) {
  const [previewState, setPreviewState] = useState(project.previewFrameFallback ? 'blocked' : 'checking')
  const [sourceLabel, setSourceLabel] = useState(getHostingSource(project.previewUrl))

  useEffect(() => {
    if (!project.previewUrl) return undefined

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

    if (!shouldCheckFramePolicy()) {
      window.clearTimeout(timeoutId)
      setPreviewState('ready')
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
        if (!cancelled) setPreviewState((current) => (current === 'checking' ? 'ready' : current))
      })
      .finally(() => window.clearTimeout(timeoutId))

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [project.previewFrameFallback, project.previewUrl])

  if (previewState === 'blocked') {
    return (
      <div className="live-preview-fallback">
        <p>{sourceLabel} blocks embedded previews for this site.</p>
        <a href={project.previewUrl} target="_blank" rel="noopener noreferrer">Open site</a>
      </div>
    )
  }

  return (
    <div className="live-preview-viewport">
      {previewState === 'checking' ? <span className="live-preview-status">Loading preview…</span> : null}
      <iframe
        title={`${project.title} website preview`}
        src={project.previewUrl}
        className="live-preview-frame"
        allow="autoplay; clipboard-read; clipboard-write; fullscreen; payment; web-share"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setPreviewState('blocked')}
      />
    </div>
  )
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [fullscreenImage, setFullscreenImage] = useState(null)

  const projects = useMemo(() => ([
    {
      id: 'linkedout',
      title: 'LinkedOUT',
      category: 'Networking platform',
      description: 'A Texas A&M networking product with verified referrals, profiles, and real-time messaging.',
      highlights: [
        'Led a four-person team building company-email verification and referral workflows',
        'Implemented real-time messaging and role-based access control',
        'Supported 200+ active users in production with automated test coverage'
      ],
      technologies: ['Ruby on Rails', 'PostgreSQL', 'JavaScript', 'Bootstrap 5', 'Stimulus.js', 'Turbo', 'Docker', 'Heroku'],
      images: projectImages('LinkedOUT', 'LinkedOUT', imageNumbers(6)),
      link: 'https://linkedout-aggies-0f3d429fef3a.herokuapp.com/',
      previewUrl: 'https://linkedout-aggies-0f3d429fef3a.herokuapp.com/',
      previewFrameFallback: true,
      github: 'https://github.com/Project-3-Group-3-CSCE-606/Project-3'
    },
    {
      id: 'nexusbase',
      title: 'NexusBase',
      category: 'Team workspace',
      description: 'Projects, files, chat, audit history, health tracking, and admin tools in one role-aware workspace.',
      highlights: [
        'Implemented Google OAuth, protected APIs, project roles, and permission-aware file sharing',
        'Modeled projects, tasks, files, activity, messaging, milestones, decisions, and risk data in Prisma/PostgreSQL',
        'Built Kanban workflows, S3 presigned uploads, workspace search, command palette, project health, and admin analytics'
      ],
      technologies: ['Next.js', 'React 19', 'TypeScript', 'Auth.js', 'Prisma', 'PostgreSQL', 'AWS S3', 'Vercel', 'Zod'],
      images: projectImages('NexusBase', 'NexusBase', imageNumbers(27)),
      link: 'https://nexus-base-kohl.vercel.app/',
      previewUrl: 'https://nexus-base-kohl.vercel.app/',
      github: 'https://github.com/freddy-nguyen-tamu/NexusBase'
    },
    {
      id: 'wavestack',
      title: 'WaveStack',
      category: 'Music platform',
      description: 'A cloud-native streaming system spanning playback, search, uploads, recommendations, analytics, and deployment.',
      highlights: [
        'Connected React/Vite, NestJS GraphQL, PostgreSQL, Neo4j, RabbitMQ, FastAPI, and .NET services',
        'Built around playback history, favorites, playlists, search, recommendations, audio jobs, waveforms, and signed URLs',
        'Added repeatable local and cloud deployment paths with Docker, Caddy, Kubernetes, Azure Bicep, and VM guidance'
      ],
      technologies: ['React', 'TypeScript', 'NestJS', 'GraphQL', 'PostgreSQL', 'Neo4j', 'RabbitMQ', 'FastAPI', 'Python', '.NET', 'Docker', 'Kubernetes', 'Azure'],
      images: projectImages('WaveStack', 'WaveStack', imageNumbers(30)),
      link: 'https://wavestack.duckdns.org/all',
      previewUrl: 'https://wavestack.duckdns.org/all',
      github: 'https://github.com/freddy-nguyen-tamu/WaveStack'
    },
    {
      id: 'aivising',
      title: 'AIvising',
      category: 'Advising assistant',
      description: 'A grounded advising chat product with citations, conversation history, feedback, and policy-content administration.',
      highlights: [
        'Built the React/TypeScript member and admin experience, including multi-conversation chat and feedback capture',
        'Implemented FastAPI retrieval that ranks document chunks, keeps six turns of context, and returns four citations per answer',
        'Added document ingestion and analytics tools for maintaining policy content and reviewing usage'
      ],
      technologies: ['React', 'TypeScript', 'Vite', 'FastAPI', 'Python', 'RAG', 'Groq API', 'Admin Analytics'],
      images: projectImages('AIvising', 'AIvising', [10, 1, 2, 4, 3, 9, 6, 8, 5, 7]),
      link: '#',
      github: 'https://github.com/freddy-nguyen-tamu/AIvising'
    },
    {
      id: 'autostreamyara',
      title: 'AutoStreamYARA',
      category: 'Security research',
      description: 'A streaming research system that generates YARA rules for evolving malware families from external threat feeds.',
      highlights: [
        'Guided an 11-person team on the rule-generation pipeline',
        'Improved malware detection accuracy by approximately 18%',
        'Reduced rule-generation latency by approximately 25%'
      ],
      technologies: ['Python', 'YARA', 'Machine Learning', 'Streaming Classification'],
      images: projectImages('AutoStreamYARA', 'AutoStreamYARA', imageNumbers(4)),
      link: '#',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 'lpc',
      title: 'LPC',
      category: 'Data transfer system',
      description: 'A cross-platform file-transfer system for large datasets with chunked processing, integrity checks, and live status.',
      highlights: [
        'Built chunk-based processing for datasets larger than 100 MB',
        'Added SHA-256 integrity validation and modular Python data workflows',
        'Reduced transfer failures by approximately 30% with real-time monitoring'
      ],
      technologies: ['Python', 'Flask', 'Kotlin', 'Android Jetpack', 'SQLite', 'REST APIs', 'Docker', 'Socket.IO', 'SHA-256', 'Fernet'],
      images: projectImages('LPC', 'LPC', [2, 1, 3]),
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 'taskmage',
      title: 'TaskMage',
      category: 'Project management',
      description: 'A collaborative Kanban product with authentication, permissions, drag-and-drop tasks, and real-time updates.',
      highlights: [
        'Built REST APIs, JWT authentication, permissions, drag-and-drop boards, and live task updates',
        'Designed the database schema and test coverage for containerized deployment',
        'Kept board updates below 20 ms during simultaneous multi-user interaction'
      ],
      technologies: ['React', 'Redux Toolkit', 'React Query', 'Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Prisma ORM', 'Docker'],
      images: projectImages('TaskMage', 'TaskMage', imageNumbers(7)),
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    }
  ]), [])

  const openModal = (project, imageIndex = 0) => {
    setSelectedProject(project)
    setModalImageIndex(imageIndex)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProject(null)
    setModalImageIndex(0)
    setFullscreenImage(null)
    document.body.style.overflow = ''
  }

  const showPrevImage = () => {
    if (!selectedProject) return
    setModalImageIndex((prev) => (prev === 0 ? selectedProject.images.length - 1 : prev - 1))
  }

  const showNextImage = () => {
    if (!selectedProject) return
    setModalImageIndex((prev) => (prev === selectedProject.images.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedProject) return

      if (fullscreenImage && event.key === 'Escape') {
        setFullscreenImage(null)
        return
      }

      if (event.key === 'Escape') closeModal()
      if (event.key === 'ArrowLeft') showPrevImage()
      if (event.key === 'ArrowRight') showNextImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedProject, fullscreenImage])

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-title projects-heading">
          <p className="section-subtitle">Selected work</p>
          <h2>Products and research.</h2>
          <p className="projects-intro">Seven projects, shown through the interfaces and systems themselves.</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={openModal} />
          ))}
        </div>
      </div>

      {selectedProject ? (
        <div className="project-modal" onClick={closeModal} role="presentation">
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} project details`}
          >
            <div className="modal-topbar">
              <span>{selectedProject.title}</span>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="Close project details">Close</button>
            </div>

            <div className="modal-image-wrapper">
              <img
                src={selectedProject.images[modalImageIndex]}
                alt={`${selectedProject.title} screenshot ${modalImageIndex + 1}`}
                className="modal-image-display"
                loading="lazy"
                decoding="async"
                onClick={() => setFullscreenImage({
                  src: selectedProject.images[modalImageIndex],
                  alt: `${selectedProject.title} screenshot ${modalImageIndex + 1}`
                })}
              />

              {selectedProject.images.length > 1 ? (
                <div className="modal-image-controls">
                  <button type="button" onClick={showPrevImage} aria-label="Previous image">Previous</button>
                  <span>{modalImageIndex + 1} / {selectedProject.images.length}</span>
                  <button type="button" onClick={showNextImage} aria-label="Next image">Next</button>
                </div>
              ) : null}
            </div>

            {selectedProject.previewUrl ? (
              <section className="live-preview-panel" aria-label={`${selectedProject.title} live website`}>
                <div className="live-preview-toolbar">
                  <h3>Website preview</h3>
                  <a href={selectedProject.previewUrl} target="_blank" rel="noopener noreferrer">Open site</a>
                </div>
                <LivePreview project={selectedProject} />
              </section>
            ) : null}

            <div className="modal-info">
              <p className="project-category">{selectedProject.category}</p>
              <h2>{selectedProject.title}</h2>
              <p className="modal-description">{selectedProject.description}</p>

              <div className="modal-details">
                <div>
                  <h3>What I built</h3>
                  <ul>
                    {selectedProject.highlights.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3>Stack</h3>
                  <p>{selectedProject.technologies.join(' · ')}</p>
                </div>
              </div>

              <div className="project-links">
                {selectedProject.link !== '#' ? (
                  <a href={selectedProject.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Open project</a>
                ) : null}
                <a href={selectedProject.github} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">Code</a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {fullscreenImage ? (
        <div className="fullscreen-image-modal" onClick={() => setFullscreenImage(null)} role="presentation">
          <button type="button" className="fullscreen-image-close" onClick={() => setFullscreenImage(null)} aria-label="Close full screen image">Close</button>
          <img
            src={fullscreenImage.src}
            alt={fullscreenImage.alt}
            className="fullscreen-image-display"
            decoding="async"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  )
}

export default Projects
