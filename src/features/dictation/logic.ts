// Pure, testable dictation scoring. No DOM, no side effects.

export type WordStatus = 'correct' | 'wrong' | 'missing' | 'extra'

export interface WordDiff {
  expected: string
  actual: string
  status: WordStatus
}

export interface DictationScore {
  correctWords: number
  totalWords: number
  accuracy: number
  correctChars: number
}

// Lowercase, strip punctuation, collapse whitespace so "Hello," matches "hello".
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenize(text: string): string[] {
  const clean = normalizeText(text)
  return clean === '' ? [] : clean.split(' ')
}

// Position-aligned diff: index i of expected vs index i of actual.
// Simple, predictable, and honest for ESL learners (no fuzzy matching).
export function diffWords(expected: string, actual: string): WordDiff[] {
  const exp = tokenize(expected)
  const act = tokenize(actual)
  const length = Math.max(exp.length, act.length)
  const out: WordDiff[] = []

  for (let i = 0; i < length; i++) {
    const e = exp[i]
    const a = act[i]
    if (e === undefined) {
      out.push({ expected: '', actual: a, status: 'extra' })
    } else if (a === undefined) {
      out.push({ expected: e, actual: '', status: 'missing' })
    } else if (e === a) {
      out.push({ expected: e, actual: a, status: 'correct' })
    } else {
      out.push({ expected: e, actual: a, status: 'wrong' })
    }
  }
  return out
}

export function scoreTranscription(target: string, typed: string): DictationScore {
  const diff = diffWords(target, typed)
  const totalWords = tokenize(target).length
  const correctWords = diff.filter((d) => d.status === 'correct').length

  let correctChars = 0
  for (const d of diff) {
    if (d.status === 'correct') correctChars += d.expected.length
  }

  const accuracy =
    totalWords === 0 ? 0 : Math.round((correctWords / totalWords) * 100)

  return { correctWords, totalWords, accuracy, correctChars }
}

export function feedbackFor(score: DictationScore): string {
  if (score.totalWords === 0) return 'Type what you hear, then check.'
  if (score.accuracy === 100) return 'Perfect! Your ears caught every word.'
  if (score.accuracy >= 80) return 'Great! Just a few misheard words to fix.'
  if (score.accuracy >= 50) return 'Good effort. Replay the audio slowly and fix the red words.'
  return 'Nice try. Slow the audio to 0.6x and listen word by word.'
}

export function missedWords(diff: WordDiff[]): string[] {
  return diff
    .filter((d) => d.status === 'wrong' || d.status === 'missing')
    .map((d) => d.expected)
    .filter((w) => w !== '')
}
