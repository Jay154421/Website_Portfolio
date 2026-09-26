import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import AppLink from '@/shared/ui/AppLink'
import Passage from '@/features/portfolio/Passage'
import Hud from './Hud'
import Burst from './Burst'
import Stickman, { type StickmanPose } from './Stickman'
import { isMuted, playSfx, setMuted } from './audio'
import {
  ENEMY_HP,
  RANK_MULT,
  RANK_ORDER,
  TOTAL_WAVES,
  initialCombat,
  reduce,
  scoreCombat,
  type CombatState,
} from './combat'
import {
  bestWpm,
  buildPassageFor,
  loadRuns,
  saveRun,
  type RunResult,
} from './game'

// Damage numbers sit over the enemy, spread so five on screen never stack.
const NUMBER_SLOTS = [
  { left: '56%', top: '6%' },
  { left: '72%', top: '32%' },
  { left: '58%', top: '50%' },
  { left: '78%', top: '12%' },
  { left: '66%', top: '0%' },
]

interface FighterSlotProps {
  tone: 'player' | 'enemy'
  pose: StickmanPose
  onSpar: (() => void) | null
}

// Renders the figure as a sparring button only when a spar can actually
// start, so no dead control is ever in the DOM.
function FighterSlot({ tone, pose, onSpar }: FighterSlotProps) {
  const figure = <Stickman pose={pose} tone={tone} />
  if (onSpar === null) return figure
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSpar}
      aria-label="Sparring: make the fighters clash"
      className="block h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {figure}
    </button>
  )
}

export default function SpeedType() {
  const [combat, setCombat] = useState<CombatState>(initialCombat)
  const [passage, setPassage] = useState(() => buildPassageFor(ENEMY_HP[0]))
  const [typed, setTyped] = useState('')
  const [runs, setRuns] = useState<RunResult[]>(loadRuns)
  const [muted, setMutedState] = useState(isMuted)
  const [now, setNow] = useState(Date.now)
  const [playerFx, setPlayerFx] = useState<StickmanPose>('idle')
  const [enemyFx, setEnemyFx] = useState<StickmanPose>('idle')
  const [numbers, setNumbers] = useState<{ id: number; value: string }[]>([])
  const [sparId, setSparId] = useState<number | null>(null)
  const [sparBlow, setSparBlow] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const panTimer = useRef<number | null>(null)
  const nextNumberId = useRef(0)
  const sparSeq = useRef(0)

  const ended = combat.phase === 'won' || combat.phase === 'lost'
  const result = ended ? scoreCombat(combat) : null
  // Blow 0 stays out of the key so a fresh spar does not remount the arena
  // before the figures have travelled; blows 1 to 3 remount and shake it.
  const sparFx = sparId !== null && sparBlow > 0 ? sparId * 10 + sparBlow : 0
  const shakeKey = combat.hurt + combat.koFlash + sparFx
  const playerPose: StickmanPose = combat.phase === 'lost' ? 'down' : playerFx
  const enemyPose: StickmanPose = combat.phase === 'won' ? 'down' : enemyFx
  const sparReady = combat.phase === 'idle' && sparId === null
  const lastWordId =
    numbers.length > 0 ? numbers[numbers.length - 1].id : null

  useEffect(() => {
    if (combat.phase !== 'fighting') return
    const id = window.setInterval(() => {
      const at = Date.now()
      setNow(at)
      setCombat((c) => reduce(c, { type: 'tick', at }))
    }, 250)
    return () => window.clearInterval(id)
  }, [combat.phase])

  // The enemy holds its hitstun pose for as long as the hits keep arriving.
  useEffect(() => {
    if (combat.impact === 0) return
    setEnemyFx('hit')
    const id = window.setTimeout(() => setEnemyFx('idle'), 170)
    return () => window.clearTimeout(id)
  }, [combat.impact])

  useEffect(() => {
    if (combat.impact === 0) return
    setPlayerFx((p) => (p === 'hit' ? p : 'punch'))
    const id = window.setTimeout(
      () => setPlayerFx((p) => (p === 'hit' ? 'hit' : 'idle')),
      150,
    )
    return () => window.clearTimeout(id)
  }, [combat.impact])

  useEffect(() => {
    if (combat.hurt === 0) return
    setPlayerFx('hit')
    // The enemy steps in with the blow that just landed, so your miss reads
    // as an exchange rather than a hit that comes from nowhere.
    setEnemyFx((e) => (e === 'hit' ? e : 'punch'))
    const id = window.setTimeout(() => {
      setPlayerFx('idle')
      setEnemyFx((e) => (e === 'punch' ? 'idle' : e))
    }, 340)
    return () => window.clearTimeout(id)
  }, [combat.hurt])

  // Purely cosmetic spar: poses only, combat state untouched. Keyed on the
  // id alone so blow updates cannot reschedule the timeline.
  useEffect(() => {
    if (sparId === null) return
    const timers = [
      window.setTimeout(() => {
        setPlayerFx('punch')
        setEnemyFx('punch')
      }, 60),
      window.setTimeout(() => {
        setEnemyFx('hit')
        setSparBlow(1)
        playSfx('hit')
      }, 260),
      window.setTimeout(() => {
        setPlayerFx('hit')
        setEnemyFx('punch')
        setSparBlow(2)
        playSfx('hurt')
      }, 480),
      window.setTimeout(() => {
        setPlayerFx('punch')
        setEnemyFx('hit')
        setSparBlow(3)
        playSfx('hit')
      }, 700),
      window.setTimeout(() => {
        setPlayerFx('idle')
        setEnemyFx('idle')
      }, 940),
      window.setTimeout(() => setSparId(null), 1140),
    ]
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [sparId])

  useEffect(
    () => () => {
      if (panTimer.current !== null) window.clearTimeout(panTimer.current)
    },
    [],
  )

  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) inputRef.current?.focus()
  }, [])

  const focusStage = () => {
    const el = inputRef.current
    if (!el) return
    el.focus()
    if (panTimer.current !== null) window.clearTimeout(panTimer.current)
    // Give the on-screen keyboard time to open before panning the passage
    // clear of it, otherwise the focused field sits behind the keyboard.
    panTimer.current = window.setTimeout(() => {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      panTimer.current = null
    }, 350)
  }

  const commit = (final: CombatState) => {
    if (final.startedAt === null) return
    if (final.phase !== 'won' && final.phase !== 'lost') return
    setRuns(saveRun({ ...scoreCombat(final), at: new Date().toISOString() }))
  }

  const restart = () => {
    setCombat(initialCombat())
    setPassage(buildPassageFor(ENEMY_HP[0]))
    setTyped('')
    setNumbers([])
    setPlayerFx('idle')
    setEnemyFx('idle')
    setSparId(null)
    setSparBlow(0)
    setNow(Date.now())
    focusStage()
  }

  const toggleSound = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
    if (!next) playSfx('rank')
  }

  const startSpar = () => {
    if (!sparReady) return
    sparSeq.current += 1
    setSparBlow(0)
    setSparId(sparSeq.current)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (ended) return

    const value = event.target.value.slice(0, passage.length)
    const previous = typed
    if (value.length <= previous.length) {
      setTyped(value)
      return
    }

    const char = value[value.length - 1]
    const at = Date.now()

    if (char !== passage[previous.length]) {
      const next = reduce(combat, { type: 'miss', at })
      setCombat(next)
      setTyped(value)
      commit(next)
      if (next.phase === 'lost') playSfx('lose')
      else if (next.hurt !== combat.hurt) playSfx('hurt')
      else playSfx('miss')
      return
    }

    const next = reduce(combat, { type: 'correct', at, index: previous.length })
    const blocked = next === combat
    const clearedWave = next.wave !== combat.wave
    const rankUp = RANK_ORDER.indexOf(next.rank) > RANK_ORDER.indexOf(combat.rank)

    setCombat(next)
    commit(next)

    if (clearedWave) {
      setTyped('')
      setPassage(buildPassageFor(next.enemyMaxHp))
    } else {
      setTyped(value)
      // The passage is sized for a clean run, but one that backspaced a lot can
      // burn through it before the enemy dies. Keep feeding words.
      if (next.enemyHp > 0 && value.length >= passage.length) {
        setPassage((p) => `${p} ${buildPassageFor(40)}`)
      }
    }

    if (!blocked && char === ' ') {
      const start = passage.lastIndexOf(' ', previous.length - 1) + 1
      const wordLength = previous.length - start
      const id = nextNumberId.current++
      setNumbers((list) =>
        [
          ...list,
          {
            id,
            value: String(Math.max(1, wordLength * Math.round(RANK_MULT[next.rank]))),
          },
        ].slice(-5),
      )
    }

    if (next.phase === 'won') playSfx('win')
    else if (clearedWave) playSfx('ko')
    else if (rankUp) playSfx('rank')
    else if (char === ' ') playSfx('hit')
    else playSfx('tick')
  }

  const statusText = ended
    ? combat.phase === 'won'
      ? 'Stage clear. All five waves cleared.'
      : `Knocked out on wave ${combat.wave}.`
    : combat.phase === 'fighting'
      ? `Wave ${combat.wave} of ${TOTAL_WAVES}. ${combat.enemyName} is still standing.`
      : 'Ready. Type the passage to start the fight, or click a fighter to spar.'

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#008080] p-2 sm:p-6">
      <div className="st-raised w-full max-w-4xl bg-[#C0C0C0] p-1.5 sm:p-2">
        <div className="st-titlebar flex h-11 items-center justify-between gap-2 pl-2">
          <h1 className="truncate text-[13px] font-bold text-white">
            Keyboard Warrior.exe
          </h1>
          <AppLink
            to="/admin"
            aria-label="Close and return to the portfolio"
            className="st-raised flex h-11 w-11 items-center justify-center bg-[#C0C0C0] text-sm font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            ✕
          </AppLink>
        </div>

        <div className="st-sunken relative mt-1.5 overflow-hidden bg-[#08090B] p-3 sm:p-5">
          <div className="st-crt" aria-hidden="true" />
          <div className="relative z-10">
            <Hud state={combat} now={now} />

            <div className="relative mt-4 h-32 sm:h-52">
              {/* Keyed on the event, not a timer: a fresh element replays the
                  shake exactly once per hit or KO. */}
              <div
                key={shakeKey}
                className={`absolute inset-0 ${shakeKey > 0 ? 'st-shake' : ''}`}
              >
                <div className="absolute inset-x-0 bottom-0 h-px bg-gray-600" />
                <div className="absolute bottom-0 left-1 h-28 w-28 sm:left-6 sm:h-48 sm:w-48">
                  <FighterSlot
                    tone="player"
                    pose={playerPose}
                    onSpar={sparReady ? startSpar : null}
                  />
                </div>
                <div className="absolute bottom-0 right-1 h-28 w-28 sm:right-6 sm:h-48 sm:w-48">
                  <FighterSlot
                    tone="enemy"
                    pose={enemyPose}
                    onSpar={sparReady ? startSpar : null}
                  />
                </div>
              </div>

              {/* Bursts sit outside the shaken, keyed layer so an unrelated
                  remount cannot replay them. The word burst keys off the
                  damage-number id: per keystroke it would stutter at touch
                  typing speeds. */}
              {lastWordId !== null && (
                <div
                  key={`word-${lastWordId}`}
                  className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
                  aria-hidden="true"
                >
                  <Burst tone="player" />
                </div>
              )}
              {combat.hurt > 0 && (
                <div
                  key={`hurt-${combat.hurt}`}
                  className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
                  aria-hidden="true"
                >
                  <Burst tone="enemy" />
                </div>
              )}
              {sparId !== null && sparBlow > 0 && (
                <div
                  key={`spar-${sparId}-${sparBlow}`}
                  className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
                  aria-hidden="true"
                >
                  <Burst tone={sparBlow === 2 ? 'enemy' : 'player'} />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {numbers.map((n) => (
                  <span
                    key={n.id}
                    className="st-float absolute font-heading text-lg font-extrabold text-white sm:text-2xl"
                    style={NUMBER_SLOTS[n.id % NUMBER_SLOTS.length]}
                  >
                    {n.value}
                  </span>
                ))}
              </div>

              {combat.koFlash > 0 && (
                <p
                  key={combat.koFlash}
                  className="st-ko pointer-events-none absolute inset-0 flex items-center justify-center font-heading text-5xl font-extrabold text-[#e04d43] sm:text-7xl"
                  aria-hidden="true"
                >
                  K.O.
                </p>
              )}
            </div>

            <label
              htmlFor="speedtype-input"
              onClick={focusStage}
              className="st-sunken mt-4 block cursor-text bg-white p-3 focus-within:ring-2 focus-within:ring-[#95271D] sm:p-4"
            >
              <span className="mb-1.5 block text-[11px] text-gray-500">
                untitled.txt
              </span>
              <Passage target={passage} typed={typed} />
              <input
                ref={inputRef}
                id="speedtype-input"
                type="text"
                value={typed}
                onChange={handleChange}
                disabled={ended}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Type the passage shown above"
                className="sr-only"
              />
            </label>

            {result && (
              <section
                className="st-sunken mt-4 bg-[#C0C0C0] p-4 sm:p-6"
                role="status"
                aria-live="polite"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                  {result.cleared ? 'Stage clear' : 'Knocked out'}
                </p>

                <div className="mt-1 flex items-end gap-3">
                  <p className="font-heading text-5xl font-extrabold leading-none text-[#7c2219] sm:text-6xl">
                    {result.wpm}
                  </p>
                  <p className="pb-1 text-sm font-semibold text-gray-700">WPM</p>
                  <p className="st-rank ml-auto font-heading text-4xl font-extrabold leading-none text-[#7c2219] sm:text-5xl">
                    {result.rank}
                  </p>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-gray-700">
                      Accuracy
                    </dt>
                    <dd className="text-lg font-semibold tabular-nums text-gray-900">
                      {result.accuracy}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-gray-700">
                      Best combo
                    </dt>
                    <dd className="text-lg font-semibold tabular-nums text-gray-900">
                      {result.bestCombo}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-gray-700">
                      Time
                    </dt>
                    <dd className="text-lg font-semibold tabular-nums text-gray-900">
                      {result.seconds}s
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-gray-700">
                      Waves
                    </dt>
                    <dd className="text-lg font-semibold tabular-nums text-gray-900">
                      {result.cleared ? TOTAL_WAVES : combat.wave}/{TOTAL_WAVES}
                    </dd>
                  </div>
                </dl>

                {bestWpm(runs) !== null && (
                  <p className="mt-3 text-sm text-gray-700">
                    Personal best: {bestWpm(runs)} WPM
                  </p>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={restart}
                    className="st-raised min-h-[48px] flex-1 bg-[#C0C0C0] px-6 text-sm font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    Run again
                  </button>
                  <AppLink
                    to="/"
                    className="st-raised min-h-[48px] flex-1 bg-[#C0C0C0] px-6 text-center text-sm font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    Back to portfolio
                  </AppLink>
                </div>

                <div className="mt-5 border-t border-gray-600 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                    Earlier runs
                  </p>
                  {runs.length <= 1 ? (
                    <p className="mt-1 text-xs text-gray-700">
                      No earlier runs yet. Run it again to start a list.
                    </p>
                  ) : (
                    <ol className="mt-1 space-y-0.5">
                      {runs.slice(1).map((run, index) => (
                        <li
                          key={run.at}
                          className="flex justify-between gap-3 text-xs tabular-nums text-gray-700"
                        >
                          <span>#{index + 2}</span>
                          <span>{run.wpm} WPM</span>
                          <span>{run.accuracy}%</span>
                          <span>{run.cleared ? 'Cleared' : 'KO'}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="st-sunken mt-1.5 flex items-center justify-between gap-3 px-2 py-1.5">
          <p className="min-w-0 flex-1 truncate text-[11px] text-black">{statusText}</p>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            className="st-raised min-h-[44px] shrink-0 bg-[#C0C0C0] px-3 text-[11px] font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            {muted ? 'Sound off' : 'Sound on'}
          </button>
        </div>
      </div>
    </div>
  )
}
