interface BurstProps {
  tone: 'player' | 'enemy'
}

// Eight-spike starburst: impact confirmation only, never load-bearing. The
// figure's own colour carries it, so red strikes read as yours and white as
// theirs, matching the CRT field's identity rule.
const TONE: Record<'player' | 'enemy', string> = {
  player: '#e04d43',
  enemy: '#E5E7EB',
}

const SPIKES =
  '97,50 65.7,56.5 83.2,83.2 56.5,65.7 50,97 43.5,65.7 16.8,83.2 34.3,56.5 ' +
  '3,50 34.3,43.5 16.8,16.8 43.5,34.3 50,3 56.5,34.3 83.2,16.8 65.7,43.5'

export default function Burst({ tone }: BurstProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      className="st-burst h-10 w-10 sm:h-14 sm:w-14"
      fill={TONE[tone]}
    >
      <polygon points={SPIKES} />
    </svg>
  )
}
