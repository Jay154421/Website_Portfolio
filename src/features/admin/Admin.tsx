import { useEffect, useState } from 'react'
import AdminShell from './AdminShell'
import OverviewPanel from './OverviewPanel'
import RunsPanel from './RunsPanel'
import SessionPanel from './SessionPanel'
import { clearSession, getSession, type Session } from '@/features/auth/auth'
import { navigate, useRoute } from '@/shared/lib/router'
import { loadRuns, type RunResult } from '@/features/speedtype/game'

export default function Admin() {
  const [session] = useState<Session | null>(() => getSession())
  const [runs] = useState<RunResult[]>(() => loadRuns())
  const path = useRoute()

  useEffect(() => {
    if (!session) navigate('/login')
  }, [session])

  if (!session) return null

  const handleSignOut = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <AdminShell activePath={path} onSignOut={handleSignOut}>
      {path === '/admin/runs' ? (
        <RunsPanel runs={runs} />
      ) : path === '/admin/session' ? (
        <SessionPanel session={session} onSignOut={handleSignOut} />
      ) : (
        <OverviewPanel />
      )}
    </AdminShell>
  )
}
