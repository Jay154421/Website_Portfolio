import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface AdminShellProps {
  activePath: string
  onSignOut: () => void
  children: ReactNode
}

export default function AdminShell({ activePath, onSignOut, children }: AdminShellProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleNavigateClose = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    if (open) {
      const firstLink = panelRef.current?.querySelector('a') as HTMLElement | null
      firstLink?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handlePointer = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return
      if (buttonRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    return () => document.removeEventListener('mousedown', handlePointer)
  }, [open])

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="flex min-h-[64px] items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <p className="font-heading text-lg font-bold text-gray-900">Dashboard</p>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="admin-menu-panel"
          className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Menu
        </button>
      </div>
      {open && (
        <div id="admin-menu-panel" ref={panelRef} className="border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <Sidebar activePath={activePath} onSignOut={onSignOut} variant="full" onNavigate={handleNavigateClose} />
        </div>
      )}
      <div className="md:flex md:min-h-screen">
        <aside className="hidden w-[72px] shrink-0 flex-col border-r border-gray-200 bg-white py-4 md:flex lg:w-60 lg:px-3">
          <div className="w-full lg:hidden">
            <Sidebar activePath={activePath} onSignOut={onSignOut} variant="rail" />
          </div>
          <div className="hidden w-full lg:block">
            <Sidebar activePath={activePath} onSignOut={onSignOut} variant="full" />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
