import type { ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: FadeInProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const directionStyles = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
  }

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionStyles[direction]}`}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
