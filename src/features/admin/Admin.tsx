import { useEffect, useState } from 'react'
import AppLink from '@/shared/ui/AppLink'
import { clearSession, getSession, type Session } from '@/features/auth/auth'
import { navigate } from '@/shared/lib/router'
import { bestWpm, loadRuns, type RunResult } from '@/features/speedtype/game'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Admin() {
  const [session] = useState<Session | null>(() => getSession())
  const [runs] = useState<RunResult[]>(() => loadRuns())

  useEffect(() => {
    if (!session) navigate('/login')
  }, [session])

  if (!session) return null

  const best = bestWpm(runs)

  const handleSignOut = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Local <span className="text-primary">dashboard</span>
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Signed in as {session.user}. Everything here is stored in this
              browser only.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AppLink
              to="/"
              className="inline-flex items-center justify-center min-h-[44px] px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Portfolio
            </AppLink>
            <button
              type="button"
              onClick={handleSignOut}
              className="min-h-[44px] px-4 bg-primary hover:bg-primary-800 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Sign out
            </button>
          </div>
        </div>

        <section className="mt-8 bg-white border border-gray-200 rounded-xl p-5 sm:p-7">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="font-heading text-lg font-semibold text-gray-900">
              Speed test runs
            </h2>
            {best !== null && (
              <p className="text-sm text-primary font-semibold">
                Personal best: {best} WPM
              </p>
            )}
          </div>

          {runs.length === 0 ? (
            <div className="mt-4 bg-[#FAF9F6] border border-dashed border-gray-300 rounded-lg px-4 py-8 text-center">
              <p className="text-gray-600 leading-relaxed">
                No runs recorded yet. Finish one on the speed test and it will
                show up here.
              </p>
              <AppLink
                to="/speedtype"
                className="mt-4 inline-flex items-center justify-center min-h-[44px] px-5 border-2 border-primary text-primary hover:bg-primary hover:text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Open speed test
              </AppLink>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Speed test runs stored in this browser
                </caption>
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th scope="col" className="py-2 pr-4 font-medium">Date</th>
                    <th scope="col" className="py-2 pr-4 font-medium">WPM</th>
                    <th scope="col" className="py-2 font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.at} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">
                        {formatDate(run.at)}
                      </td>
                      <td
                        className={`py-3 pr-4 font-semibold whitespace-nowrap ${
                          run.wpm === best ? 'text-primary' : 'text-gray-900'
                        }`}
                      >
                        {run.wpm}
                      </td>
                      <td className="py-3 text-gray-700 whitespace-nowrap">
                        {run.accuracy}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
