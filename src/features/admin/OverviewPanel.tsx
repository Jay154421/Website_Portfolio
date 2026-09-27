import { useEffect, useState } from 'react'
import { navigate } from '@/shared/lib/router'
import { loadRuns } from '@/features/speedtype/game'
import { deriveStats, storageStatus } from './stats'
import { PanelEmpty, PanelError, PanelSkeleton } from './PanelState'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function OverviewPanel() {
  const [runs] = useState(() => loadRuns())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLoading(false)
      return
    }
    const id = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(id)
  }, [])

  if (storageStatus() === 'blocked') {
    return (
      <PanelError message="Browser storage is blocked, so saved runs cannot be read here. Allow storage access and reload to see stats." />
    )
  }
  if (loading) return <PanelSkeleton label="Loading runs" />
  if (runs.length === 0) {
    return (
      <PanelEmpty
        title="No runs yet"
        body="Finish a run on the speed test and it will show here."
        actionLabel="Open speed test"
        onAction={() => navigate('/speedtype')}
      />
    )
  }
  const stats = deriveStats(runs)
  const wpms = runs.map((run) => run.wpm)
  const hi = Math.max(...wpms)
  const lo = Math.min(...wpms)
  const span = Math.max(hi - lo, 1)
  const pts = wpms.map((w, i) => `${10 + (i * 280) / Math.max(wpms.length - 1, 1)},${86 - ((w - lo) / span) * 66}`).join(' ')

  return (
    <section aria-label="Overview" className="rounded-xl border border-gray-200 bg-white p-6">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-sm text-gray-600">Total runs</dt>
          <dd className="mt-1 text-2xl font-bold text-primary-800">{stats.runCount}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Best WPM</dt>
          <dd className="mt-1 text-2xl font-bold text-primary-800">{stats.bestWpm}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Best accuracy</dt>
          <dd className="mt-1 text-2xl font-bold text-primary-800">{stats.bestAccuracy}%</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Last run</dt>
          <dd className="mt-1 text-lg font-bold text-primary-800">{stats.lastRunAt ? formatDate(stats.lastRunAt) : 'None'}</dd>
        </div>
      </dl>
      {runs.length >= 2 && (
        <div className="mt-6">
          <h3 className="font-heading text-base font-semibold text-gray-900">Words per minute across your runs.</h3>
          <svg role="img" viewBox="0 0 300 96" className="mt-3 h-24 w-full">
            <title>Words per minute across your runs.</title>
            <polyline points={pts} fill="none" stroke="#7c2219" strokeWidth="2" />
          </svg>
          <ul className="sr-only">
            {runs.map((run) => (
              <li key={run.at}>WPM {run.wpm} on {formatDate(run.at)}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
