import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import './Contact.css'

const Contact = () => {
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!formspreeEndpoint) {
      setSubmitError('Form service is not configured yet.')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      setSubmitError('Unable to send your message right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div ref={titleRef} className={`section-title ${titleInView ? 'visible' : ''}`}>
          <p className="section-subtitle">Get In Touch</p>
          <h2>Contact Me</h2>
          <div className="title-underline"></div>
        </div>

        <div ref={contentRef} className={`contact-content ${contentInView ? 'visible' : ''}`}>
          <div className="contact-info">
            <div className="info-item">
              <h3>Email</h3>
              <p>quan.ng@tamu.edu</p>
              <div className="social-links">
                <a href="mailto:quan.ng@tamu.edu" className="social-link">
                  Send a message
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            {submitError ? <p className="form-status form-status-error">{submitError}</p> : null}
            {isSubmitted ? <p className="form-status form-status-success">Message sent successfully.</p> : null}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent!' : 'Send message!'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
