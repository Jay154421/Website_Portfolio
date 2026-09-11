import FadeIn from './FadeIn'

export default function About() {
  return (
    <section
      id="about"
      className="py-20 bg-gray-50"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Photo Placeholder */}
          <FadeIn direction="left" className="w-64 h-64 flex-shrink-0">
            <div
              className="w-full h-full rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm"
              aria-label="Profile photo placeholder"
            >
              <span className="text-6xl">📷</span>
            </div>
          </FadeIn>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <FadeIn>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-6"
              >
                About <span className="text-primary">Me</span>
              </h2>
            </FadeIn>

            <FadeIn delay={100}>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Hello! I'm a passionate full-stack developer with a love for
                creating beautiful, functional web applications. With several
                years of experience in the industry, I've worked on projects
                ranging from small business websites to large-scale enterprise
                applications.
              </p>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community. I believe in writing clean, maintainable
                code and building user experiences that make a difference.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-lg text-gray-600 leading-relaxed">
                I'm always open to new opportunities and collaborations.
                Whether you have a project in mind or just want to say hello,
                feel free to reach out!
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
