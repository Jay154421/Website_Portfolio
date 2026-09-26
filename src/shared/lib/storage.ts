const PREFIX = 'portfolio:'

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    // Corrupt JSON or blocked storage: fall back instead of crashing the page.
    return fallback
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Quota or private-mode errors are non-fatal, the UI keeps working without persistence.
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    // Same as above, nothing to clean up if storage is unavailable.
  }
}

// Probes with a write plus remove so blocked storage is detectable.
// readJson swallows errors by design, so it can never report them.
export function isStorageAvailable(): boolean {
  try {
    window.localStorage.setItem(PREFIX + 'probe', '1')
    window.localStorage.removeItem(PREFIX + 'probe')
    return true
  } catch {
    // Private mode, quota, or disabled storage: reads fall back silently.
    return false
  }
}
