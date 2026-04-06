import { useInView } from 'react-intersection-observer'
import './About.css'

const About = () => {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const skills = [
    { name: 'JavaScript/React/Node.js', level: 92 },
    { name: 'C/C++/C#/Unity', level: 88 },
    { name: 'Python & ML Libraries', level: 85 },
    { name: 'Ruby on Rails', level: 80 },
    { name: 'HTML/CSS/Tailwind', level: 90 },
    { name: 'SQL/PostgreSQL', level: 82 },
    { name: 'Docker & DevOps', level: 85 },
    { name: 'Project Management', level: 90 },
    { name: 'Git & REST APIs', level: 88 },
    { name: 'Socket.IO/Real-time', level: 80 }
  ]

  const experience = [
    {
      title: 'Research Assistant',
      company: 'Center for Assistive, Rehabilitation, and Robotics Technologies',
      period: 'August 2024',
      description: 'Guided a team of 7 to design comprehensive test plans for validating functionality, message exchange, connection, error handling and performance for a Virtual Reality system enabling vocational rehabilitation. Optimized system latency to under 35ms for real-time responsiveness and validated >95% data conversion accuracy into Unity-compatible transforms.'
    }
  ]

  const education = [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Texas A&M University',
      period: 'Current - May 2027 (Expected)',
      description: 'College Station, TX'
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of South Florida',
      period: 'Fall 2021 - May 2025',
      description: 'GPA: 3.86/4.0 | GRE: V: 155 M: 168 | Tampa, FL | Judy Genshaft Honors College, Direct Entry | Merit-Based Green and Gold Presidential Award'
    },
    {
      degree: 'High School Diploma',
      school: 'Le Hong Phong High School for the Gifted',
      period: '2016 - June 2020',
      description: 'GPA: 8.5/10 | SAT I: M: 800 V: 740 | IELTS: 7.5 | HCMC, Vietnam'
    }
  ]

  return (
    <section id="about" className="about">
      <div className="container">
        <div ref={titleRef} className={`section-title ${titleInView ? 'visible' : ''}`}>
          <h2>About Me</h2>
          <div className="title-underline"></div>
        </div>

        <div ref={contentRef} className={`about-content ${contentInView ? 'visible' : ''}`}>
          <div className="about-intro">
            <p className="intro-text">
              I am a proactive Computer Science graduate with experience in leading software projects from 
              conception to deployment. Skilled in leveraging full-stack development to build efficient 
              applications, with a strong focus on project management, team coordination, and clear communication.
            </p>
            <p className="intro-text">
              Proven ability to manage timelines, facilitate team meetings, and document processes using tools 
              like Microsoft Office, Zoom, and project management platforms to ensure project success. Currently 
              pursuing a Master's degree in Computer Science at Texas A&M University.
            </p>
          </div>

          <div className="skills-section">
            <h3>Skills & Expertise</h3>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div 
                  key={skill.name} 
                  className="skill-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress"
                      style={{ 
                        width: contentInView ? `${skill.level}%` : '0%',
                        transitionDelay: `${index * 0.1}s`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
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
    </section>
  )
}

export default About
