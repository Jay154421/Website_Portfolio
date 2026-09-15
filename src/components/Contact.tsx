import { useState } from 'react'
import FadeIn from './FadeIn'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setSubmitted(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }
  return (
    <section
      id="contact"
      className="py-20 bg-[#FAF9F6]/70"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 text-center mb-4"
          >
            Get In <span className="text-primary">Touch</span>
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
        </FadeIn>

        <FadeIn delay={200}>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
            I'm always open to new opportunities and collaborations.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <FadeIn direction="left" delay={300}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Email</h3>
                <a
                  href="mailto:jaybodiongan1230@gmail.com"
                  className="text-primary hover:text-primary-800 transition-colors"
                >
                  jaybodiongan1230@gmail.com
                </a>
              </div>

              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">Iligan City, Philippines</p>
              </div>

              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Availability</h3>
                <p className="text-gray-600">
                  Open to freelance opportunities and full-time positions.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Contact Form */}
          <FadeIn direction="right" delay={400}>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center" role="status">
                <p className="text-green-700 font-medium">Thank you! Your message has been sent.</p>
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your message..."
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
