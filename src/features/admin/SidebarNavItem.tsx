import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import AppLink from '@/shared/ui/AppLink'

interface SidebarNavItemProps {
  to: string
  label: string
  icon: LucideIcon
  active: boolean
  onNavigate?: () => void
}

export default function SidebarNavItem({ to, label, icon: Icon, active, onNavigate }: SidebarNavItemProps) {
  return (
    <AppLink
      to={to}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex w-full items-center gap-3 rounded-lg px-3 min-h-[44px] text-sm transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        active
          ? 'bg-primary/10 font-semibold text-primary-800'
          : 'font-normal text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </AppLink>
  )
}
