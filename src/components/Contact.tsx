import FadeIn from './FadeIn'

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 bg-gray-50"
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
                  href="mailto:your.email@example.com"
                  className="text-primary hover:text-primary-800 transition-colors"
                >
                  your.email@example.com
                </a>
              </div>

              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">Your City, Country</p>
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
            <form
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
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
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Your name"
                />
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
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
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
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
