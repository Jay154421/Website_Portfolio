import FadeIn from './FadeIn'

const projects = [
  {
    title: 'Project One',
    description:
      'A brief description of this project. It showcases your skills and the technologies used.',
    image: null,
    tags: ['React', 'TypeScript', 'Tailwind'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project-one',
  },
  {
    title: 'Project Two',
    description:
      'Another amazing project you worked on. Highlight the key features and your contributions.',
    image: null,
    tags: ['Node.js', 'PostgreSQL', 'Express'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project-two',
  },
  {
    title: 'Project Three',
    description:
      'A third project that demonstrates your expertise. What problems did it solve?',
    image: null,
    tags: ['Python', 'Django', 'REST API'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project-three',
  },
]

export default function Projects() {
  return (
    <section
      id="projects"
      className="py-20 bg-gray-50"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2
            id="projects-heading"
            className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 text-center mb-4"
          >
            Featured <span className="text-primary">Projects</span>
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="w-20 h-1 bg-primary mx-auto mb-12" />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <FadeIn key={project.title} delay={index * 150}>
              <article className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group h-full">
                {/* Project Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-200">
                  <span className="text-4xl group-hover:scale-110 transition-transform">🖼️</span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-800 text-sm font-medium transition-colors"
                      aria-label={`View ${project.title} live demo`}
                    >
                      Live Demo →
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                      aria-label={`View ${project.title} source code on GitHub`}
                    >
                      GitHub →
                    </a>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
