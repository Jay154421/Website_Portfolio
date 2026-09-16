import { useState } from 'react'
import FadeIn from './FadeIn'
import ProjectModal from './ProjectModal'

import thesisImg1 from '../assets/thesis_project/Automated Smart Waste Bin System.png'
import thesisImg2 from '../assets/thesis_project/dashboard.png'
import thesisImg3 from '../assets/thesis_project/Login Page.png'
import thesisImg4 from '../assets/thesis_project/student management.png'
import thesisImg5 from '../assets/thesis_project/Redeem points management.png'

const projects = [
  {
    title: 'AI-Powered Smart Waste System',
    description:
      'Engineered an end-to-end automated classification system using Python, integrating custom software logic with hardware interactions.',
    longDescription:
      'Engineered an end-to-end automated classification system using Python, integrating custom software logic with hardware interactions. Designed data-handling pipelines and clean user interface features to process real-time system feedback and telemetry. Troubleshot and debugged software and hardware integration issues as they arose, optimizing overall application performance and reliability.',
    image: null,
    images: [thesisImg1, thesisImg2, thesisImg3, thesisImg4, thesisImg5],
    tags: ['Python', 'Custom Software', 'Hardware Integration', 'IoT'],
    liveUrl: 'https://github.com/Jay154421',
    githubUrl: 'https://github.com/Jay154421',
    role: 'Full-Stack Developer',
    duration: 'Jan 2024 – May 2024',
    features: [
      'Real-time waste classification using AI/ML models',
      'Automated sorting mechanism with hardware integration',
      'Dashboard for monitoring waste data and analytics',
      'Student management module for tracking users',
      'Redeem points system to incentivize proper waste disposal',
      'Login system with role-based access control',
    ],
  },
  {
    title: 'Project One',
    description:
      'A brief description of this project. It showcases your skills and the technologies used.',
    longDescription:
      'A brief description of this project. It showcases your skills and the technologies used. This project demonstrates modern web development practices with a focus on performance and user experience.',
    image: null,
    images: [],
    tags: ['React', 'TypeScript', 'Tailwind'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project-one',
    role: 'Frontend Developer',
    duration: '2024',
    features: [
      'Responsive design with Tailwind CSS',
      'Type-safe development with TypeScript',
      'Component-based architecture with React',
    ],
  },
  {
    title: 'Project Two',
    description:
      'Another amazing project you worked on. Highlight the key features and your contributions.',
    longDescription:
      'Another amazing project you worked on. Highlight the key features and your contributions. Built with a focus on scalability and clean architecture.',
    image: null,
    images: [],
    tags: ['Node.js', 'PostgreSQL', 'Express'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project-two',
    role: 'Backend Developer',
    duration: '2024',
    features: [
      'RESTful API design with Express.js',
      'Database optimization with PostgreSQL',
      'Authentication and authorization system',
    ],
  },
  {
    title: 'Project Three',
    description:
      'A third project that demonstrates your expertise. What problems did it solve?',
    longDescription:
      'A third project that demonstrates your expertise. What problems did it solve? This project tackles real-world challenges with innovative solutions.',
    image: null,
    images: [],
    tags: ['Python', 'Django', 'REST API'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project-three',
    role: 'Full-Stack Developer',
    duration: '2024',
    features: [
      'Django REST framework for API development',
      'Automated testing and CI/CD pipeline',
      'Performance monitoring and logging',
    ],
  },
]

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[number] | null>(null)

  return (
    <section
      id="projects"
      className="py-20 bg-[#FAF9F6]/70"
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
              <article
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group h-full cursor-pointer"
              >
                {/* Project Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center border-b border-gray-200">
                  {project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-4xl group-hover:scale-110 transition-transform">🖼️</span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      Live Demo →
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                      aria-label={`View ${project.title} source code on GitHub`}
                      onClick={(e) => e.stopPropagation()}
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

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
