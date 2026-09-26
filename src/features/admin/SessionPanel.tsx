import { useEffect, useState } from 'react'
import { navigate } from '@/shared/lib/router'
import type { Session } from '@/features/auth/auth'
import { PanelEmpty, PanelSkeleton } from './PanelState'

interface SessionPanelProps {
  session: Session | null
  onSignOut: () => void
}

export default function SessionPanel({ session, onSignOut }: SessionPanelProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true)
      return
    }
    const id = window.setTimeout(() => setReady(true), 400)
    return () => window.clearTimeout(id)
  }, [])

  if (!ready) return <PanelSkeleton label="Loading session" />

  if (!session)
    return (
      <PanelEmpty
        title="No active session"
        body="You are signed out. Sign in to open the local dashboard."
        actionLabel="Go to login"
        onAction={() => navigate('/login')}
      />
    )

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-heading text-lg font-bold text-gray-900">Session</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Username</dt>
          <dd className="font-semibold text-gray-900">{session.user}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Signed in</dt>
          <dd className="text-gray-700">{new Date(session.loggedInAt).toLocaleString()}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-gray-600">This session lives in this browser only.</p>
      <button
        type="button"
        onClick={onSignOut}
        className="mt-4 min-h-[44px] px-4 bg-primary hover:bg-primary-800 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Sign out
      </button>
    </section>
  )
}
