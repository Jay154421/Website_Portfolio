import { useState, useEffect, useRef } from 'react'

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.replace('#', ''))
    const navbarHeight = 64

    const getMostVisibleSection = (): string => {
      let bestId = 'hero'
      let bestVisibility = -1

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        const visibleTop = Math.max(rect.top, navbarHeight)
        const visibleBottom = Math.min(rect.bottom, viewportHeight)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)

        if (visibleHeight > bestVisibility) {
          bestVisibility = visibleHeight
          bestId = id
        }
      }

      return bestId
    }

    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50
        if (atBottom) {
          setActiveSection(sectionIds[sectionIds.length - 1])
        } else {
          setActiveSection(getMostVisibleSection())
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      const firstLink = menuRef.current?.querySelector('a') as HTMLElement
      firstLink?.focus()
    }
  }, [isOpen])

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#hero"
            className="text-xl font-bold font-heading text-primary hover:text-primary-800 transition-colors"
          >
            Portfolio
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`transition-colors text-sm font-medium ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {link.name}
                </a>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div ref={menuRef} className="md:hidden pb-4 border-t border-gray-200">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/5 font-semibold'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
