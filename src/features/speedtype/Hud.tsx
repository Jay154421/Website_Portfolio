import {
  MISS_STRIKE_AT,
  PLAYER_MAX_HP,
  TOTAL_WAVES,
  accuracyOf,
  type CombatState,
} from './combat'

interface BarProps {
  label: string
  value: number
  max: number
  fill: string
  readout: string
}

function Bar({ label, value, max, fill, readout }: BarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <span className="text-[11px] font-medium tabular-nums text-gray-300">
          {readout}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        className="mt-1 h-2.5 w-full border border-gray-500 bg-gray-900"
      >
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%`, background: fill }}
        />
      </div>
    </div>
  )
}

export default function Hud({ state, now }: { state: CombatState; now: number }) {
  const accuracy = Math.round(accuracyOf(state) * 100)
  const seconds = state.startedAt === null ? 1 : Math.max((now - state.startedAt) / 1000, 1)
  const wpm = Math.round(state.correctChars / 5 / (seconds / 60))

  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
      <div className="min-w-0 space-y-2.5">
        <Bar
          label={`${state.enemyName} (wave ${state.wave}/${TOTAL_WAVES})`}
          value={state.enemyHp}
          max={state.enemyMaxHp}
          fill="#E5E7EB"
          readout={`${Math.ceil(state.enemyHp)} / ${state.enemyMaxHp}`}
        />
        <Bar
          label="You"
          value={state.playerHp}
          max={PLAYER_MAX_HP}
          fill="#e04d43"
          readout={`${state.playerHp} / ${PLAYER_MAX_HP}`}
        />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
          <span className="tabular-nums">WPM {wpm}</span>
          <span className="tabular-nums">ACC {accuracy}%</span>
          <span className="tabular-nums">
            MISS {state.missStreak}/{MISS_STRIKE_AT}
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {Array.from({ length: MISS_STRIKE_AT }, (_, i) => (
              <span
                key={i}
                className={`block h-2 w-2 border border-gray-500 ${
                  i < state.missStreak ? 'bg-[#e04d43]' : 'bg-transparent'
                }`}
              />
            ))}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Style
          </p>
          <p
            key={state.rank}
            className="st-rank font-heading text-4xl font-extrabold leading-none text-[#e04d43] sm:text-5xl"
          >
            {state.rank}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Combo
          </p>
          <p className="font-heading text-2xl font-extrabold leading-none tabular-nums text-white sm:text-3xl">
            {state.combo}
          </p>
        </div>
      </div>
    </div>
  )
}
