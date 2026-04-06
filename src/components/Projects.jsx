import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import screenshot74 from './assets/linkedout/Screenshot (74).png';
import './Projects.css'

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
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
      image: screenshot74,
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
      image: screenshot74,
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
      // image: 'https://via.placeholder.com/600x400/50C878/ffffff?text=LinkedOUT',
      image: screenshot74,
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 4,
      title: 'Streaming Malware Classification Research',
      category: 'Security / Research Systems',
      description:
        'A research system for automatically generating YARA rules for real-time detection of evolving malware families from external threat feeds.',
      highlights: [
        'Guided a team of 11 on scalable rule-generation pipeline design',
        'Improved malware detection accuracy by ~18%',
        'Reduced rule generation latency by ~25%'
      ],
      technologies: ['Python', 'YARA', 'Machine Learning', 'Streaming Classification'],
      image: screenshot74,
      link: '#',
      github: 'https://github.com/freddy-nguyen-tamu'
    }
  ]

  const ProjectCard = ({ project, index }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1
    })

    return (
      <div
        ref={ref}
        className={`project-card ${inView ? 'visible' : ''}`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => setSelectedProject(project)}
      >
        <div className="project-image">
          <img src={project.image} alt={project.title} />
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
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              &times;
            </button>

            <div className="modal-image">
              <img src={selectedProject.image} alt={selectedProject.title} />
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