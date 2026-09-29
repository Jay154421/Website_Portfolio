import { Ear, Gauge, Keyboard, ListOrdered, LogOut } from 'lucide-react'
import clsx from 'clsx'
import AppLink from '@/shared/ui/AppLink'
import SidebarNavItem from './SidebarNavItem'

interface SidebarProps {
  activePath: string
  onSignOut: () => void
  onNavigate?: () => void
  variant?: 'full' | 'rail'
}

const routes = [
  { to: '/admin', label: 'Overview', icon: Gauge },
  { to: '/admin/runs', label: 'Runs', icon: ListOrdered },
] as const

const footerLinkClass = 'flex w-full items-center gap-3 rounded-lg px-3 min-h-[44px] text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-normal text-gray-700 hover:bg-gray-100 hover:text-gray-900'

const railLinkClass = (active: boolean) =>
  clsx(
    'flex w-full min-h-[44px] flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-center text-[11px] leading-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    active ? 'bg-primary/10 font-semibold text-primary-800' : 'font-normal text-gray-700 hover:bg-gray-100 hover:text-gray-900'
  )

export default function Sidebar({ activePath, onSignOut, onNavigate, variant = 'full' }: SidebarProps) {
  if (variant === 'rail') {
    return (
      <div className="flex w-[72px] flex-col gap-1">
        <nav aria-label="Admin" className="flex flex-col gap-1">
          {routes.map(({ to, label, icon: Icon }) => (
            <AppLink key={to} to={to} onClick={onNavigate} aria-current={activePath === to ? 'page' : undefined} className={railLinkClass(activePath === to)}>
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </AppLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-gray-200 pt-2">
          <AppLink to="/speedtype" onClick={onNavigate} className={railLinkClass(false)}>
            <Keyboard className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Speed test</span>
          </AppLink>
          <AppLink to="/dictation" onClick={onNavigate} className={railLinkClass(false)}>
            <Ear className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Dictation</span>
          </AppLink>
          <button type="button" onClick={onSignOut} className={railLinkClass(false)}>
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1">
      <nav aria-label="Admin" className="flex flex-col gap-1">
        {routes.map(({ to, label, icon }) => (
          <SidebarNavItem key={to} to={to} label={label} icon={icon} active={activePath === to} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-1 border-t border-gray-200 pt-2">
        <AppLink to="/speedtype" onClick={onNavigate} className={footerLinkClass}>
          <Keyboard className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="truncate">Speed test</span>
        </AppLink>
        <AppLink to="/dictation" onClick={onNavigate} className={footerLinkClass}>
          <Ear className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="truncate">Dictation</span>
        </AppLink>
        <button type="button" onClick={onSignOut} className={footerLinkClass}>
          <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="truncate">Sign out</span>
        </button>
      </div>
    </div>
  )
}
