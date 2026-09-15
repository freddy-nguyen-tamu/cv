import { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!formspreeEndpoint) {
      setSubmitError('The contact form is not configured yet. Please email me directly.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Request failed')

      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      window.setTimeout(() => setIsSubmitted(false), 3000)
    } catch {
      setSubmitError('I could not send that message. Please email me directly instead.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title contact-title">
          <p className="section-subtitle">Contact</p>
          <h2>Let&apos;s talk about the work.</h2>
        </div>

        <div className="contact-content">
          <div className="contact-direct">
            <p>If you&apos;re hiring, collaborating, or comparing notes on a systems problem, email is the fastest way to reach me.</p>
            <a href="mailto:quan.ng@tamu.edu">quan.ng@tamu.edu</a>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group form-group-message">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {submitError ? <p className="form-status form-status-error" role="alert">{submitError}</p> : null}
            {isSubmitted ? <p className="form-status form-status-success" role="status">Message sent.</p> : null}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : isSubmitted ? 'Sent' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
