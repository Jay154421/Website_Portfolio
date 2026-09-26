import { readJson, writeJson } from './storage'

const RUNS_KEY = 'speedtype.runs'
const MAX_STORED_RUNS = 10

export const TIME_LIMIT_SECONDS = 30
const PASSAGE_WORDS = 50

export interface RunResult {
  wpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
  at: string
}

const WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is',
]

// Randomness is injected so the picker stays testable (explicit dependency).
export function buildPassage(
  wordCount: number = PASSAGE_WORDS,
  random: () => number = Math.random,
): string {
  const picks: string[] = []
  for (let i = 0; i < wordCount; i++) {
    picks.push(WORDS[Math.floor(random() * WORDS.length)])
  }
  return picks.join(' ')
}

export function scoreRun(
  target: string,
  typed: string,
  elapsedSeconds: number,
): Omit<RunResult, 'at'> {
  let correct = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++
  }
  const incorrect = typed.length - correct
  const minutes = Math.max(elapsedSeconds, 1) / 60
  const wpm = Math.round(correct / 5 / minutes)
  const accuracy =
    typed.length === 0 ? 0 : Math.round((correct / typed.length) * 100)
  return { wpm, accuracy, correctChars: correct, incorrectChars: incorrect }
}

export function loadRuns(): RunResult[] {
  return readJson<RunResult[]>(RUNS_KEY, [])
}

export function saveRun(result: RunResult): RunResult[] {
  const runs = [result, ...loadRuns()].slice(0, MAX_STORED_RUNS)
  writeJson(RUNS_KEY, runs)
  return runs
}

export function bestWpm(runs: RunResult[]): number | null {
  if (runs.length === 0) return null
  return runs.reduce((best, run) => Math.max(best, run.wpm), 0)
}
