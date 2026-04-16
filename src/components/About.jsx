import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import './About.css'
import avatarImage from './assets/avatar2.png'
import { scrollToSection } from '../utils/scrollToSection'

const About = () => {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [avatarStyle, setAvatarStyle] = useState({
    rotateX: -4,
    rotateY: 8,
    rotateZ: -7
  })

  const skillGroups = [
    {
      title: 'Languages',
      items: ['Python', 'SQL', 'JavaScript', 'Kotlin', 'Ruby', 'C/C++', 'C#', 'PHP']
    },
    {
      title: 'Frameworks & Platforms',
      items: ['Flask', 'React', 'Node.js/Express', 'Ruby on Rails', 'Android Jetpack', 'Ktor']
    },
    {
      title: 'Data & Systems',
      items: ['JSON', 'SQLite', 'PostgreSQL', 'ETL-style pipelines', 'REST APIs', 'Socket.IO']
    },
    {
      title: 'Tools',
      items: ['Git', 'Docker', 'Docker Compose', 'Prisma ORM', 'Google Cloud Platform', 'Jest/Supertest']
    }
  ]

  const experience = [
    {
      title: 'Researcher',
      company: 'Texas A&M University',
      period: 'Aug 2025 - Present',
      description:
        'Guiding a team of 11 on a streaming malware classification system that automatically generates YARA rules for real-time detection of evolving malware families. Focused on scalable pipeline design, adaptive backends, and machine learning-driven rule generation.'
    },
    {
      title: 'Research Assistant',
      company: 'Center for Assistive, Rehabilitation, and Robotics Technologies',
      period: 'Aug 2024',
      description:
        'Guided a team of 7 to design validation and performance testing for a virtual reality rehabilitation system, helping optimize latency to under 35ms and validating high-accuracy Unity-compatible data conversion.'
    }
  ]

  const education = [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Texas A&M University',
      period: 'Expected May 2027',
      description: 'College Station, TX'
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of South Florida',
      period: 'May 2025',
      description: 'GPA: 3.86 / 4.0'
    }
  ]

  const handleAvatarMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    setAvatarStyle({
      rotateX: (0.5 - y) * 8,
      rotateY: (x - 0.5) * 10,
      rotateZ: (x - 0.5) * 2
    })
  }

  const resetAvatarTilt = () => {
    setAvatarStyle({
      rotateX: -4,
      rotateY: 8,
      rotateZ: -7
    })
  }

  return (
    <section id="about" className="about">
      <div className="container">
        <div ref={titleRef} className={`section-title ${titleInView ? 'visible' : ''}`}>
          <h2>About Me</h2>
          <div className="title-underline"></div>
        </div>

        <div ref={contentRef} className={`about-content ${contentInView ? 'visible' : ''}`}>
          <div className="about-layout">
            <div className="about-visual">
              <div className="about-avatar-backdrop" aria-hidden="true"></div>
              <div
                className="about-avatar-card"
                onMouseMove={handleAvatarMove}
                onMouseLeave={resetAvatarTilt}
                style={{
                  transform: `perspective(1200px) rotateX(${avatarStyle.rotateX}deg) rotateY(${avatarStyle.rotateY}deg) rotateZ(${avatarStyle.rotateZ}deg)`
                }}
              >
                <img src={avatarImage} alt="Quan Nguyen avatar illustration" className="about-avatar-image" />
              </div>
            </div>

            <div className="about-main">
              <div className="about-intro">
                <p className="intro-text">
                  I am a Computer Science graduate student with experience building scalable software systems,
                  structured data workflows, and full-stack applications. My work spans Python-based pipelines,
                  SQL-backed systems, real-time applications, and security-focused research.
                </p>
                <p className="intro-text">
                  I enjoy building reliable systems that are measurable, efficient, and production-minded from
                  chunk-based file processing and real-time dashboards to authenticated platforms, messaging
                  systems, and malware detection workflows.
                </p>
              </div>

              <div className="skills-section">
                <h3>Technical Strengths</h3>
                <div className="skills-grid">
                  {skillGroups.map((group) => (
                    <div key={group.title} className="timeline-content">
                      <h4>{group.title}</h4>
                      <p>{group.items.join(' • ')}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary about-talk-button"
                  onClick={() => scrollToSection('contact')}
                >
                  Let's talk
                </button>
              </div>

              <div className="timeline-section">
                <h3>Experience</h3>
                <div className="timeline">
                  {experience.map((item, index) => (
                    <div
                      key={index}
                      className="timeline-item"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>{item.title}</h4>
                        <h5>{item.company}</h5>
                        <span className="timeline-period">{item.period}</span>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="timeline-section">
                <h3>Education</h3>
                <div className="timeline">
                  {education.map((item, index) => (
                    <div
                      key={index}
                      className="timeline-item"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>{item.degree}</h4>
                        <h5>{item.school}</h5>
                        <span className="timeline-period">{item.period}</span>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
