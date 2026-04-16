import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import screenshot74 from './assets/linkedout/linkedout1.png'
import screenshot75 from './assets/linkedout/linkedout2.png'
import screenshot76 from './assets/linkedout/linkedout3.png'
import screenshot77 from './assets/linkedout/linkedout4.png'
import screenshot78 from './assets/linkedout/linkedout5.png'
import screenshot79 from './assets/linkedout/linkedout6.png'
import yara1 from './assets/autoyara/yara1.png'
import yara2 from './assets/autoyara/yara2.png'
import yara3 from './assets/autoyara/yara3.png'
import yara4 from './assets/autoyara/yara4.png'
import lpc1 from './assets/lpc/lpc1.png'
import lpc2 from './assets/lpc/lpc2.png'
import lpc3 from './assets/lpc/lpc3.png'
import taskmage1 from './assets/taskmage/taskmage1.png'
import taskmage2 from './assets/taskmage/taskmage2.png'
import taskmage3 from './assets/taskmage/taskmage3.png'
import taskmage4 from './assets/taskmage/taskmage4.png'
import taskmage5 from './assets/taskmage/taskmage5.png'
import taskmage6 from './assets/taskmage/taskmage6.png'
import taskmage7 from './assets/taskmage/taskmage7.png'
import aivising1 from './assets/aivising/aivising1.png'
import aivising2 from './assets/aivising/aivising2.png'
import aivising3 from './assets/aivising/aivising3.png'
import aivising4 from './assets/aivising/aivising4.png'
import aivising5 from './assets/aivising/aivising5.png'
import aivising6 from './assets/aivising/aivising6.png'
import aivising7 from './assets/aivising/aivising7.png'
import aivising8 from './assets/aivising/aivising8.png'
import aivising9 from './assets/aivising/aivising9.png'
import aivising10 from './assets/aivising/aivising10.png'

import './Projects.css'

const AUTO_SCROLL_INTERVAL = 2000

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

        {project.images.length > 1 && (
          <div className="preview-dots">
            {project.images.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`preview-dot ${dotIndex === previewIndex ? 'active' : ''}`}
              />
            ))}
          </div>
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

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [modalImageIndex, setModalImageIndex] = useState(0)

  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const projects = [
    {
      id: 5,
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
        aivising10,
        aivising1,
        aivising2,
        aivising4,
        aivising3,
        aivising9,
        aivising6,
        aivising8,
        aivising5,
        aivising7
      ],
      link: '#',
      github: 'https://github.com/freddy-nguyen-tamu/AIvising'
    },
    {
      id: 1,
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
      images: [lpc2, lpc1, lpc3],
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 2,
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
      images: [taskmage1, taskmage2, taskmage3, taskmage4, taskmage5, taskmage6, taskmage7],
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 3,
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
      images: [screenshot74, screenshot75, screenshot76, screenshot77, screenshot78, screenshot79],
      link: 'https://linkedout-aggies-0f3d429fef3a.herokuapp.com/users/new',
      github: 'https://github.com/Project-3-Group-3-CSCE-606/Project-3'
    },
    {
      id: 4,
      title: 'AutoYARA',
      category: 'Security / Research Systems',
      description:
        'A research system for automatically generating YARA rules for real-time detection of evolving malware families from external threat feeds.',
      highlights: [
        'Guided a team of 11 on scalable rule-generation pipeline design',
        'Improved malware detection accuracy by ~18%',
        'Reduced rule generation latency by ~25%'
      ],
      technologies: ['Python', 'YARA', 'Machine Learning', 'Streaming Classification'],
      images: [yara1, yara2, yara3, yara4],
      link: '#',
      github: 'https://github.com/freddy-nguyen-tamu'
    }
  ]

  const openModal = (project, imageIndex = 0) => {
    setSelectedProject(project)
    setModalImageIndex(imageIndex)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProject(null)
    setModalImageIndex(0)
    document.body.style.overflow = 'unset'
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

      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') showPrevImage()
      if (e.key === 'ArrowRight') showNextImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div ref={titleRef} className={`section-title ${titleInView ? 'visible' : ''}`}>
          <h2>Projects & Research</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
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
              </div>

              {selectedProject.images.length > 1 && (
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
            </div>

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
    </section>
  )
}

export default Projects
