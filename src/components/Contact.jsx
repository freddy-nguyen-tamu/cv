import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div ref={titleRef} className={`section-title ${titleInView ? 'visible' : ''}`}>
          <h2>Contact</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Open to software engineering, research, and systems-focused opportunities</p>
        </div>

        <div ref={contentRef} className={`contact-content ${contentInView ? 'visible' : ''}`}>
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>quan.ng@tamu.edu</p>
            </div>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <h3>Location</h3>
              <p>College Station, TX</p>
            </div>

            <div className="info-item">
              <div className="info-icon">🎓</div>
              <h3>Current Focus</h3>
              <p>Full-stack engineering, data systems, real-time platforms, and security research</p>
            </div>

            <div className="social-links">
              <a
                href="https://github.com/freddy-nguyen-tamu"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                GitHub
              </a>
              <a
                href="https://freddynguyen.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Website
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              {isSubmitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact