import { readJson, removeKey, writeJson } from './storage'

const SESSION_KEY = 'session'

// Demo gate only: every visitor can read these credentials in the bundle,
// so this never protects real data (stated on the login page itself).
const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

export interface Session {
  user: string
  loggedInAt: string
}

export function validateCredentials(username: string, password: string): boolean {
  return (
    username.trim() === DEMO_CREDENTIALS.username &&
    password === DEMO_CREDENTIALS.password
  )
}

export function getSession(): Session | null {
  return readJson<Session | null>(SESSION_KEY, null)
}

export function saveSession(user: string): Session {
  const session: Session = { user, loggedInAt: new Date().toISOString() }
  writeJson(SESSION_KEY, session)
  return session
}

export function clearSession(): void {
  removeKey(SESSION_KEY)
}
