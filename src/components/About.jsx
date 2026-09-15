import './About.css'

const About = () => {
  const skillGroups = [
    ['Languages', 'Python, SQL, JavaScript, Kotlin, Ruby, C/C++, C#, PHP'],
    ['Web & APIs', 'React, Flask, Node.js/Express, Ruby on Rails, REST, Socket.IO'],
    ['Data & Systems', 'PostgreSQL, SQLite, ETL pipelines, Docker, Google Cloud Platform'],
    ['Tools', 'Git, Prisma ORM, Jest/Supertest, Android Jetpack, Ktor']
  ]

  const experience = [
    {
      title: 'Researcher',
      company: 'Texas A&M University',
      period: 'Aug 2025 — Present',
      description:
        'Leading an 11-person team building a streaming malware-classification system that generates YARA rules for evolving malware families.'
    },
    {
      title: 'Research Assistant',
      company: 'Center for Assistive, Rehabilitation, and Robotics Technologies',
      period: 'Aug 2024 — Jul 2025',
      description:
        'Led testing for a seven-person VR rehabilitation project, validating Unity-compatible data conversion and helping bring pipeline latency below 35 ms.'
    }
  ]

  const education = [
    {
      degree: 'M.S. Computer Science',
      school: 'Texas A&M University',
      period: 'Expected May 2027',
      description: 'College Station, Texas'
    },
    {
      degree: 'B.S. Computer Science',
      school: 'University of South Florida',
      period: 'May 2025',
      description: 'GPA 3.86 / 4.00'
    }
  ]

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-title about-title">
          <p className="section-subtitle">Background</p>
          <h2>Engineering with the details in view.</h2>
        </div>

        <div className="about-intro-grid">
          <p className="about-lead">
            I&apos;m a computer science graduate student at Texas A&amp;M. My work sits between product engineering
            and systems research: web platforms, data movement, real-time collaboration, and malware detection.
          </p>
          <p className="about-note">
            I like work where the interface and the underlying system have to agree—clear behavior for the user,
            measurable behavior underneath.
          </p>
        </div>

        <div className="about-columns">
          <section className="about-block" aria-labelledby="skills-heading">
            <h3 id="skills-heading">Skills</h3>
            <dl className="skill-list">
              {skillGroups.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="about-block" aria-labelledby="experience-heading">
            <h3 id="experience-heading">Experience</h3>
            <div className="background-list">
              {experience.map((item) => (
                <article key={`${item.title}-${item.company}`}>
                  <div className="background-row">
                    <div>
                      <h4>{item.title}</h4>
                      <p className="background-place">{item.company}</p>
                    </div>
                    <span>{item.period}</span>
                  </div>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about-block about-education" aria-labelledby="education-heading">
            <h3 id="education-heading">Education</h3>
            <div className="background-list">
              {education.map((item) => (
                <article key={item.degree}>
                  <div className="background-row">
                    <div>
                      <h4>{item.degree}</h4>
                      <p className="background-place">{item.school}</p>
                    </div>
                    <span>{item.period}</span>
                  </div>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default About
