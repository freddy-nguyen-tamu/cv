import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import screenshot74 from './assets/linkedout/Screenshot (74).png'
import screenshot75 from './assets/linkedout/Screenshot (75).png'
import screenshot76 from './assets/linkedout/Screenshot (76).png'
import screenshot77 from './assets/linkedout/Screenshot (77).png'
import screenshot78 from './assets/linkedout/Screenshot (78).png'
import screenshot79 from './assets/linkedout/Screenshot (79).png'
import yara1 from './assets/autoyara/yara1.png'
import lpc1 from './assets/lpc/lpc1.png'
import lpc2 from './assets/lpc/lpc2.png'
import lpc3 from './assets/lpc/lpc3.png'

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
      images: [lpc1, lpc2, lpc3],
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
      images: [screenshot74, screenshot74, screenshot74],
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
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
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
      images: [yara1, screenshot74, screenshot74],
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
            Selected work across scalable systems, security research, and full-stack application development
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