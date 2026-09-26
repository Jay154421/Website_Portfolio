import { useCallback, useEffect, useRef, useState } from 'react'
import AppLink from '@/shared/ui/AppLink'
import Passage from '@/features/portfolio/Passage'
import {
  bestWpm,
  buildPassage,
  saveRun,
  scoreRun,
  TIME_LIMIT_SECONDS,
  type RunResult,
} from './game'

const TIME_LIMIT_MS = TIME_LIMIT_SECONDS * 1000
type Status = 'idle' | 'running' | 'done'

export default function SpeedType() {
  const [passage, setPassage] = useState(() => buildPassage())
  const [typed, setTyped] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [startAt, setStartAt] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [result, setResult] = useState<RunResult | null>(null)
  const [runs, setRuns] = useState<RunResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const secondsLeft = Math.max(
    0,
    Math.ceil((TIME_LIMIT_MS - elapsedMs) / 1000),
  )
  const live = scoreRun(passage, typed, elapsedMs / 1000)

  const endRun = useCallback(
    (typedValue: string, ms: number) => {
      const run: RunResult = {
        ...scoreRun(passage, typedValue, ms / 1000),
        at: new Date().toISOString(),
      }
      setResult(run)
      setRuns(saveRun(run))
      setStatus('done')
    },
    [passage],
  )

  useEffect(() => {
    if (status !== 'running') return
    const id = window.setInterval(() => {
      const ms = Date.now() - startAt
      if (ms >= TIME_LIMIT_MS) {
        setElapsedMs(TIME_LIMIT_MS)
        endRun(typed, TIME_LIMIT_MS)
      } else {
        setElapsedMs(ms)
      }
    }, 200)
    return () => window.clearInterval(id)
  }, [status, startAt, typed, endRun])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'done') return
    const value = e.target.value.slice(0, passage.length)
    const starting = status === 'idle'
    const runStart = starting ? Date.now() : startAt

    if (starting) {
      setStartAt(runStart)
      setStatus('running')
      setElapsedMs(0)
    }
    setTyped(value)
    if (value.length >= passage.length) {
      endRun(value, Date.now() - runStart)
    }
  }

  const handleRestart = () => {
    setPassage(buildPassage())
    setTyped('')
    setStatus('idle')
    setStartAt(0)
    setElapsedMs(0)
    setResult(null)
    inputRef.current?.focus()
  }

  const statBox = (label: string, value: string) => (
    <div className="bg-white border border-gray-200 rounded-lg px-2 py-3 sm:px-4 sm:py-4 text-center">
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="font-heading text-xl sm:text-3xl font-bold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AppLink
          to="/"
          className="inline-flex items-center min-h-[44px] text-sm text-gray-600 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Back to portfolio
        </AppLink>

        <header className="mt-2 mb-6">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            Speed <span className="text-primary">type</span>
          </h1>
          <p className="mt-2 text-gray-600 leading-relaxed">
            Type the passage before the {TIME_LIMIT_SECONDS} second clock runs
            out. Every run is saved in this browser.
          </p>
        </header>

        {status === 'done' && result ? (
          <div
            className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center"
            role="status"
          >
            <p className="text-sm text-gray-500">Run complete</p>
            <p className="font-heading text-6xl sm:text-7xl font-bold text-primary mt-2">
              {result.wpm}
            </p>
            <p className="text-gray-600 font-medium">WPM</p>

            <dl className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              <div>
                <dt className="text-xs sm:text-sm text-gray-500">Accuracy</dt>
                <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900">
                  {result.accuracy}%
                </dd>
              </div>
              <div>
                <dt className="text-xs sm:text-sm text-gray-500">Correct</dt>
                <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900">
                  {result.correctChars}
                </dd>
              </div>
              <div>
                <dt className="text-xs sm:text-sm text-gray-500">Missed</dt>
                <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900">
                  {result.incorrectChars}
                </dd>
              </div>
            </dl>

            {bestWpm(runs) !== null && (
              <p className="mt-4 text-sm text-gray-600">
                Personal best: {bestWpm(runs)} WPM
              </p>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleRestart}
                className="min-h-[48px] px-6 bg-primary hover:bg-primary-800 text-white font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Run again
              </button>
              <AppLink
                to="/"
                className="min-h-[48px] px-6 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Back to portfolio
              </AppLink>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Saved to this browser's local storage.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
              {statBox('Time left', String(secondsLeft))}
              {statBox('WPM', String(live.wpm))}
              {statBox('Accuracy', `${live.accuracy}%`)}
            </div>

            <label
              htmlFor="speedtype-input"
              className="block bg-white border border-gray-200 rounded-xl p-5 sm:p-7 cursor-text focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent"
            >
              <Passage target={passage} typed={typed} />
              <input
                ref={inputRef}
                id="speedtype-input"
                type="text"
                value={typed}
                onChange={handleChange}
                disabled={status === 'done'}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Type the passage shown above"
                className="sr-only"
              />
            </label>

            <p className="mt-4 text-sm text-gray-600 text-center">
              {status === 'idle'
                ? 'Click the passage and start typing. The clock starts on your first key.'
                : 'Keep going until the clock runs out or the passage is finished.'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
