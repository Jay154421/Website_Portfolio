import { useEffect, useState } from 'react'
import { navigate } from '@/shared/lib/router'
import { bestWpm } from '@/features/speedtype/game'
import type { RunResult } from '@/features/speedtype/game'
import { PanelEmpty, PanelSkeleton } from './PanelState'

interface RunsPanelProps {
  runs: RunResult[]
}

function formatRunDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function RunsPanel({ runs }: RunsPanelProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLoading(false)
      return
    }
    const timer = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  if (loading) return <PanelSkeleton label="Loading runs" />
  if (runs.length === 0) {
    return (
      <PanelEmpty
        title="No runs yet"
        body="Take the speed test to record your first run. Your results will show here."
        actionLabel="Take the speed test"
        onAction={() => navigate('/speedtype')}
      />
    )
  }

  const best = bestWpm(runs)
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Your speed test runs by date</caption>
        <thead>
          <tr className="border-b border-gray-200 text-gray-600">
            <th scope="col" className="px-4 py-3 font-semibold">Date</th>
            <th scope="col" className="px-4 py-3 font-semibold">WPM</th>
            <th scope="col" className="px-4 py-3 font-semibold">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run, index) => {
            const isBest = best !== null && run.wpm === best
            return (
              <tr key={`${run.at}-${index}`} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 text-gray-700">{formatRunDate(run.at)}</td>
                <td className={isBest ? 'px-4 py-3 font-semibold text-primary-800' : 'px-4 py-3 text-gray-700'}>
                  {run.wpm}{isBest ? ' (best)' : null}
                </td>
                <td className="px-4 py-3 text-gray-700">{run.accuracy}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
