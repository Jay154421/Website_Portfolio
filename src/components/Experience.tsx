import FadeIn from './FadeIn'

const experiences = [
  {
    title: 'Full-Stack Developer Intern',
    company: 'Iligan City Civil Registry Office',
    period: 'Feb 2026 – May 2026',
    description:
      'Participated in the full development life cycle to co-develop B-TRACE, a cross-platform desktop and web application designed to streamline registry workflows. Engineered dynamic frontend logic in ReactJS for applicant validation and built robust backend and database pipelines for real-time tracking. Wrote clean, maintainable, and efficient code to create dynamic UI states and automated document generation tools, enhancing operational efficiency. Utilized Git and GitHub for version control, code reviews, and collaborative development across the engineering team.',
    technologies: ['React.js', , 'Node.js', 'SQLITE', 'Git', 'GitHub'],
  },
  {
    title: 'Senior Developer',
    company: 'Tech Company',
    period: '2022 - Present',
    description:
      'Leading development of scalable web applications. Mentoring junior developers and implementing best practices across the team.',
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS'],
  },
  {
    title: 'Full Stack Developer',
    company: 'Startup Inc.',
    period: '2020 - 2022',
    description:
      'Built and maintained multiple client projects from concept to deployment. Collaborated with designers and product managers.',
    technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'Junior Developer',
    company: 'Digital Agency',
    period: '2018 - 2020',
    description:
      'Developed responsive websites and web applications for various clients. Gained experience in modern web technologies.',
    technologies: ['JavaScript', 'HTML/CSS', 'PHP', 'MySQL'],
  },
]

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-20 bg-white"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2
            id="experience-heading"
            className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 text-center mb-4"
          >
            Work <span className="text-primary">Experience</span>
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="w-20 h-1 bg-primary mx-auto mb-12" />
        </FadeIn>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-primary transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <FadeIn
                key={exp.title}
                delay={index * 200}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <article
                  className={`relative flex flex-col md:flex-row ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 mt-6 border-2 border-white shadow-lg shadow-primary/20" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'
                    }`}
                  >
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-primary/30 transition-colors shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-heading font-semibold text-gray-900">
                          {exp.title}
                        </h3>
                        <span className="text-gray-400">@</span>
                        <span className="text-primary font-medium">{exp.company}</span>
                      </div>

                      <time className="text-sm text-gray-500 block mb-3">
                        {exp.period}
                      </time>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
