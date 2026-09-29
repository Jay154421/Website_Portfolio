import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '@/shared/lib/router'

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
}

// Keeps href real (middle-click and open-in-new-tab still work) while
// normal clicks go through the client-side router.
export default function AppLink({ to, onClick, children, ...rest }: AppLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
