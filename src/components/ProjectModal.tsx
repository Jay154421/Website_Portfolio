import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import clsx from 'clsx'

interface Project {
  title: string
  description: string
  longDescription: string
  image: null
  images: string[]
  tags: string[]
  liveUrl: string
  githubUrl: string
  role: string
  duration: string
  features: string[]
}

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isImageFullscreen) {
          setIsImageFullscreen(false)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose, isImageFullscreen])

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-gray-100 transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Image Gallery */}
        {project.images.length > 0 && (
          <div className="relative bg-gray-100">
            <div className="overflow-hidden">
              <img
                src={project.images[activeIndex]}
                alt={`${project.title} screenshot ${activeIndex + 1}`}
                className="w-full h-64 object-contain"
              />
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsImageFullscreen(true)}
              className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-gray-700" />
            </button>

            {/* Navigation Arrows */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </>
            )}

            {/* Dots */}
            {project.images.length > 1 && (
              <div className=" absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-red-100 rounded-full px-3 py-1.5 backdrop-blur-sm">
                {project.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={clsx(
                      'w-2 h-2 rounded-full transition-colors',
                      idx === activeIndex ? 'bg-primary' : 'bg-white/70 hover:bg-white'
                    )}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Row */}
            {project.images.length > 1 && (
              <div className=" flex gap-2 p-3 overflow-x-auto">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={clsx(
                      ' flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors',
                      idx === activeIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-1">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              {project.role && <span>{project.role}</span>}
              {project.role && project.duration && <span>•</span>}
              {project.duration && <span>{project.duration}</span>}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-5">
            {project.longDescription || project.description}
          </p>

          {/* Features */}
          {project.features.length > 0 && (
            <div className="mb-5">
              <h4 className="font-heading font-semibold text-gray-900 mb-2">Key Features</h4>
              <ul className="space-y-1.5">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-primary mt-1">▸</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors"
            >
              Live Demo →
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Overlay */}
      {isImageFullscreen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
          onClick={() => setIsImageFullscreen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsImageFullscreen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
            aria-label="Exit fullscreen"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Fullscreen Image */}
          <img
            src={project.images[activeIndex]}
            alt={`${project.title} screenshot ${activeIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation Arrows */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {project.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 rounded-full text-white text-sm">
              {activeIndex + 1} / {project.images.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
