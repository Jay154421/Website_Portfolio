import { isStorageAvailable } from '@/shared/lib/storage'
import type { RunResult } from '@/features/speedtype/game'

export interface RunStats {
  runCount: number
  bestWpm: number | null
  bestAccuracy: number | null
  lastRunAt: string | null
}

export type StorageStatus = 'ok' | 'blocked'

export function deriveStats(runs: RunResult[]): RunStats {
  if (runs.length === 0) {
    return { runCount: 0, bestWpm: null, bestAccuracy: null, lastRunAt: null }
  }
  const bestWpm = runs.reduce((best, run) => Math.max(best, run.wpm), 0)
  const bestAccuracy = runs.reduce((best, run) => Math.max(best, run.accuracy), 0)
  const lastRunAt = runs.reduce(
    (latest, run) => (run.at > latest ? run.at : latest),
    runs[0].at,
  )
  return { runCount: runs.length, bestWpm, bestAccuracy, lastRunAt }
}

export function storageStatus(): StorageStatus {
  return isStorageAvailable() ? 'ok' : 'blocked'
}
