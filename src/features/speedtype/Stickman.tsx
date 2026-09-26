export type StickmanPose = 'idle' | 'punch' | 'hit' | 'down'

interface StickmanProps {
  pose: StickmanPose
  tone: 'player' | 'enemy'
  className?: string
}

// Limb coordinates only, so a pose swap is instant while the lunge stays a
// transform. A punch reads from the body snap, not from interpolated limbs.
const POSES: Record<StickmanPose, { head: [number, number]; limbs: number[] }> = {
  idle: { head: [50, 16], limbs: [50, 25, 50, 58, 50, 33, 33, 45, 50, 33, 67, 45, 50, 58, 39, 85, 50, 58, 61, 85] },
  punch: { head: [52, 16], limbs: [50, 25, 52, 58, 50, 33, 32, 38, 50, 33, 86, 31, 52, 58, 38, 85, 52, 58, 66, 85] },
  hit: { head: [44, 14], limbs: [47, 23, 55, 58, 47, 31, 28, 20, 47, 31, 66, 26, 55, 58, 43, 85, 55, 58, 68, 85] },
  down: { head: [50, 16], limbs: [50, 25, 50, 58, 50, 33, 33, 45, 50, 33, 67, 45, 50, 58, 39, 85, 50, 58, 61, 85] },
}

const TONE: Record<'player' | 'enemy', string> = {
  player: '#e04d43',
  enemy: '#E5E7EB',
}

// Lunge distance in percent of the figure's own width, tuned so the fists
// meet mid-arena at both the h-28 and h-48 figure sizes.
const LUNGE_FORWARD = 50
const LUNGE_BACK = 28

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Screen-space shift derived from the pose, so the body travel can never
// disagree with the pose swap. Forward and back flip sign with tone: the
// player closes to the right, the enemy to the left.
function shiftFor(pose: StickmanPose, tone: 'player' | 'enemy'): number {
  if (REDUCED_MOTION) return 0
  const dir = tone === 'player' ? 1 : -1
  if (pose === 'punch') return LUNGE_FORWARD * dir
  if (pose === 'hit') return -LUNGE_BACK * dir
  return 0
}

function segment(key: number, coords: number[]) {
  return (
    <line
      key={key}
      x1={coords[key]}
      y1={coords[key + 1]}
      x2={coords[key + 2]}
      y2={coords[key + 3]}
    />
  )
}

export default function Stickman({ pose, tone, className }: StickmanProps) {
  const { head, limbs } = POSES[pose]
  const segments = [0, 4, 8, 12, 16].map((i) => segment(i, limbs))
  // Translate outside the mirror: the shift stays screen-space while the
  // figure faces the opponent.
  const transform = `translateX(${shiftFor(pose, tone)}%) scaleX(${
    tone === 'enemy' ? -1 : 1
  })`

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      className={`st-lunge h-full w-auto ${className ?? ''}`}
      fill="none"
      stroke={TONE[tone]}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.6))',
        transform,
      }}
    >
      <g transform={pose === 'down' ? 'rotate(-74 50 92)' : undefined}>
        <circle cx={head[0]} cy={head[1]} r={9} />
        {segments}
      </g>
    </svg>
  )
}
