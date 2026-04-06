import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
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
      title: 'TaskMage',
      category: 'Full-stack Development',
      description: 'Project management platform with authenticated workflows, real-time Kanban boards, role-based access, and fast optimistic UI updates. Built REST API with permissions, real-time task updates, Kanban drag-and-drop, JWT auth. Benchmark-tested to handle simultaneous multi-user interactions with consistent sub-20ms board update latency.',
      technologies: ['React', 'Redux Toolkit', 'React Query', 'Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Prisma ORM', 'Tailwind CSS', 'Docker'],
      image: 'https://via.placeholder.com/600x400/4A90E2/ffffff?text=TaskMage',
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 2,
      title: 'ExpenseTracker',
      category: 'Project Management & Development',
      description: 'A web application for managing personal and group expenses, supporting secure account management, messaging with expense context, group organization, and data backup/restore. Guided a 4-person team in full-stack development. Managed project, facilitated meetings, SOP documentation with Microsoft Office, Zoom, and PM tools. Completed within timeline with 100% tested codes deployed to production.',
      technologies: ['Ruby on Rails', 'JavaScript', 'HTML/CSS', 'PostgreSQL', 'REST APIs', 'Microsoft Office', 'Zoom', 'Slack', 'Confluence'],
      image: 'https://via.placeholder.com/600x400/7B68EE/ffffff?text=ExpenseTracker',
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 3,
      title: 'MealMatch',
      category: 'Team Leadership & Development',
      description: 'A recipe discovery platform allowing users to intuitively build ingredient lists, search recipes, swipe interactively, and save favorites. Guided a team of 4 in full-stack development of responsive search engine, interactive swipe, and customizable filters. Managed development, facilitated meetings, and documentation. Completed within timeline with 100% tested codes deployed to production.',
      technologies: ['Ruby on Rails', 'JavaScript', 'HTML/CSS', 'PostgreSQL', 'REST APIs', 'Microsoft Office', 'Zoom', 'Slack', 'Adobe Illustrator'],
      image: 'https://via.placeholder.com/600x400/50C878/ffffff?text=MealMatch',
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 4,
      title: 'Acme Ads',
      category: 'Web Development',
      description: 'A static marketing website and WordPress product mockup deployed on GitHub Pages for advertising services. Developed and deployed WordPress-based advertising mockup as a static site, implemented responsive ad display and media support, managed theme customization, Docker setup, and project documentation. Enabled 100% mobile responsiveness across 3 major devices and deployment to GitHub Pages serving ~1,000+ demo views.',
      technologies: ['PHP', 'HTML', 'CSS', 'JavaScript', 'Docker', 'WordPress', 'GitHub Pages'],
      image: 'https://via.placeholder.com/600x400/FF6347/ffffff?text=Acme+Ads',
      link: 'https://github.com/freddy-nguyen-tamu',
      github: 'https://github.com/freddy-nguyen-tamu'
    },
    {
      id: 5,
      title: 'Wall-E Following Robot',
      category: 'Robotics & Team Leadership',
      description: 'A line-following robot with 100% success rate in a complex environment. Guided a team of 5 using Agile methodology and Scrum framework to develop algorithms for Wall-E robot to follow a colored line using ultrasonic sensor. Completed the project within timeline and budget with 100% success rate.',
      technologies: ['Arduino', 'C++', 'Ultrasonic Sensors', 'Agile/Scrum'],
      image: 'https://via.placeholder.com/600x400/FFD700/ffffff?text=Wall-E+Robot',
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
            {project.technologies.map(tech => (
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
          <h2>Projects</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Key projects demonstrating full-stack development and team leadership</p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Project Modal */}
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
              <div className="project-technologies">
                {selectedProject.technologies.map(tech => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={selectedProject.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  Live Demo
                </a>
                <a href={selectedProject.github} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
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
