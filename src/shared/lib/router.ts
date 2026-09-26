import { useEffect, useState } from 'react'

// Pathname-only routing: vercel.json rewrites every path to index.html, so
// deep links like /speedtype work on direct load without react-router.
export function currentPath(): string {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '' ? '/' : path
}

export function navigate(path: string): void {
  if (currentPath() === path) return
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useRoute(): string {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const handlePop = () => setPath(currentPath())
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  return path
}
