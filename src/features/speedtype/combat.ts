import type { RunResult } from './game'

export type Rank = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS'
export type Phase = 'idle' | 'fighting' | 'won' | 'lost'

export const TOTAL_WAVES = 5
export const PLAYER_MAX_HP = 100
export const PLAYER_HIT_DAMAGE = 15
export const MISS_STRIKE_AT = 5
export const RANK_DECAY_MS = 1500

// Enemy HP is matched to passage length in game.ts: a clean run at the lowest
// multiplier (D, 1.0) types exactly this many correct characters to kill it.
export const ENEMY_HP = [100, 140, 180, 220, 300]
export const ENEMY_NAMES = ['Pop-Up', 'Dial-Up', 'Blue Screen', 'Spam Wall', 'The Admin']

export const RANK_ORDER: Rank[] = ['D', 'C', 'B', 'A', 'S', 'SS']
export const RANK_MULT: Record<Rank, number> = {
  D: 1,
  C: 1.2,
  B: 1.4,
  A: 1.7,
  S: 2,
  SS: 2.5,
}

export interface CombatState {
  phase: Phase
  wave: number
  enemyName: string
  enemyHp: number
  enemyMaxHp: number
  playerHp: number
  combo: number
  bestCombo: number
  missStreak: number
  rank: Rank
  correctChars: number
  missChars: number
  // Highest passage index already validated, so backspacing and retyping a
  // finished stretch cannot deal the same damage twice.
  progress: number
  startedAt: number | null
  endedAt: number | null
  lastCorrectAt: number | null
  lastDecayAt: number
  impact: number
  hurt: number
  koFlash: number
}

export type CombatAction =
  | { type: 'correct'; at: number; index: number }
  | { type: 'miss'; at: number }
  | { type: 'tick'; at: number }
  | { type: 'reset' }

export function initialCombat(): CombatState {
  return {
    phase: 'idle',
    wave: 1,
    enemyName: ENEMY_NAMES[0],
    enemyHp: ENEMY_HP[0],
    enemyMaxHp: ENEMY_HP[0],
    playerHp: PLAYER_MAX_HP,
    combo: 0,
    bestCombo: 0,
    missStreak: 0,
    rank: 'D',
    correctChars: 0,
    missChars: 0,
    progress: 0,
    startedAt: null,
    endedAt: null,
    lastCorrectAt: null,
    lastDecayAt: 0,
    impact: 0,
    hurt: 0,
    koFlash: 0,
  }
}

// Rank climbs with combo length, then an accuracy gate holds it back so mashing
// cannot buy a high multiplier. One typo costs a single step rather than the
// whole ladder, which keeps a slip recoverable mid-run.
function rankFor(combo: number, accuracy: number): Rank {
  let target: Rank = 'D'
  if (combo >= 200) target = 'SS'
  else if (combo >= 100) target = 'S'
  else if (combo >= 50) target = 'A'
  else if (combo >= 25) target = 'B'
  else if (combo >= 10) target = 'C'

  const cap = accuracy < 0.8 ? 1 : accuracy < 0.9 ? 2 : RANK_ORDER.length - 1
  return RANK_ORDER[Math.min(RANK_ORDER.indexOf(target), cap)]
}

function stepDown(rank: Rank): Rank {
  const i = RANK_ORDER.indexOf(rank)
  return i <= 0 ? 'D' : RANK_ORDER[i - 1]
}

export function accuracyOf(state: CombatState): number {
  const total = state.correctChars + state.missChars
  return total === 0 ? 0 : state.correctChars / total
}

export function reduce(state: CombatState, action: CombatAction): CombatState {
  switch (action.type) {
    case 'reset':
      return initialCombat()

    case 'correct': {
      if (state.phase === 'won' || state.phase === 'lost') return state
      if (action.index < state.progress) return state

      const correctChars = state.correctChars + 1
      const combo = state.combo + 1
      const accuracy = correctChars / (correctChars + state.missChars)
      const raised = rankFor(combo, accuracy)
      const rank =
        RANK_ORDER.indexOf(raised) > RANK_ORDER.indexOf(state.rank)
          ? raised
          : state.rank

      const enemyHp = state.enemyHp - RANK_MULT[rank]
      const next: CombatState = {
        ...state,
        phase: state.phase === 'idle' ? 'fighting' : state.phase,
        correctChars,
        combo,
        bestCombo: Math.max(state.bestCombo, combo),
        missStreak: 0,
        rank,
        progress: action.index + 1,
        startedAt: state.startedAt ?? action.at,
        lastCorrectAt: action.at,
        impact: state.impact + 1,
      }

      if (enemyHp > 0) {
        return { ...next, enemyHp }
      }

      const koFlash = state.koFlash + 1
      if (state.wave >= TOTAL_WAVES) {
        return { ...next, enemyHp: 0, phase: 'won', endedAt: action.at, koFlash }
      }

      // Clearing a wave swaps the enemy in the same keystroke, so the next key
      // already lands on the fresh passage and no input is dropped.
      const wave = state.wave + 1
      return {
        ...next,
        wave,
        koFlash,
        progress: 0,
        enemyName: ENEMY_NAMES[wave - 1],
        enemyMaxHp: ENEMY_HP[wave - 1],
        enemyHp: ENEMY_HP[wave - 1],
      }
    }

    case 'miss': {
      if (state.phase === 'won' || state.phase === 'lost') return state

      const missChars = state.missChars + 1
      const rank = stepDown(state.rank)
      const phase: Phase = state.phase === 'idle' ? 'fighting' : state.phase
      const base: CombatState = {
        ...state,
        phase,
        missChars,
        combo: 0,
        rank,
        missStreak: state.missStreak + 1,
        startedAt: state.startedAt ?? action.at,
      }

      if (base.missStreak < MISS_STRIKE_AT) return base

      const playerHp = Math.max(0, state.playerHp - PLAYER_HIT_DAMAGE)
      return {
        ...base,
        playerHp,
        missStreak: 0,
        hurt: state.hurt + 1,
        ...(playerHp <= 0 ? { phase: 'lost' as Phase, endedAt: action.at } : {}),
      }
    }

    case 'tick': {
      if (state.phase !== 'fighting' || state.rank === 'D') return state
      if (state.lastCorrectAt === null) return state
      if (action.at - state.lastCorrectAt < RANK_DECAY_MS) return state
      if (action.at - state.lastDecayAt < RANK_DECAY_MS) return state
      return { ...state, rank: stepDown(state.rank), lastDecayAt: action.at }
    }
  }
}

export function scoreCombat(state: CombatState): Omit<RunResult, 'at'> {
  const seconds =
    state.startedAt !== null && state.endedAt !== null
      ? (state.endedAt - state.startedAt) / 1000
      : 0
  const minutes = Math.max(seconds, 1) / 60
  return {
    wpm: Math.round(state.correctChars / 5 / minutes),
    accuracy: Math.round(accuracyOf(state) * 100),
    correctChars: state.correctChars,
    incorrectChars: state.missChars,
    rank: state.rank,
    cleared: state.phase === 'won',
    seconds: Math.round(seconds),
    bestCombo: state.bestCombo,
  }
}
