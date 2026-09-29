import { readJson, writeJson } from '@/shared/lib/storage'

export type Sfx = 'tick' | 'hit' | 'miss' | 'hurt' | 'ko' | 'rank' | 'win' | 'lose'

const MUTE_KEY = 'speedtype.muted'

let ctx: AudioContext | null = null
let muted = readJson<boolean>(MUTE_KEY, false)

export function isMuted(): boolean {
  return muted
}

export function setMuted(next: boolean): void {
  muted = next
  writeJson(MUTE_KEY, next)
}

// Created lazily so the context starts after the first keystroke, which is the
// user gesture browsers require before audio can run.
function audio(): AudioContext | null {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

interface Tone {
  type: OscillatorType
  from: number
  to: number
  ms: number
  gain: number
  delay?: number
}

function tone(a: AudioContext, t: Tone): void {
  const start = a.currentTime + (t.delay ?? 0)
  const osc = a.createOscillator()
  const amp = a.createGain()
  osc.type = t.type
  osc.frequency.setValueAtTime(t.from, start)
  if (t.to !== t.from) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(t.to, 1), start + t.ms / 1000)
  }
  amp.gain.setValueAtTime(0.0001, start)
  amp.gain.exponentialRampToValueAtTime(t.gain, start + 0.008)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + t.ms / 1000)
  osc.connect(amp).connect(a.destination)
  osc.start(start)
  osc.stop(start + t.ms / 1000 + 0.03)
}

export function playSfx(name: Sfx): void {
  if (muted) return
  const a = audio()
  if (!a) return

  switch (name) {
    case 'tick':
      tone(a, { type: 'square', from: 340, to: 240, ms: 45, gain: 0.03 })
      break
    case 'hit':
      tone(a, { type: 'square', from: 420, to: 160, ms: 90, gain: 0.06 })
      break
    case 'miss':
      tone(a, { type: 'sawtooth', from: 160, to: 70, ms: 120, gain: 0.05 })
      break
    case 'hurt':
      tone(a, { type: 'square', from: 120, to: 45, ms: 240, gain: 0.08 })
      break
    case 'ko':
      tone(a, { type: 'square', from: 520, to: 60, ms: 340, gain: 0.08 })
      break
    case 'rank':
      tone(a, { type: 'triangle', from: 480, to: 920, ms: 170, gain: 0.06 })
      break
    case 'win':
      ;[523, 659, 784, 1046].forEach((f, i) =>
        tone(a, { type: 'triangle', from: f, to: f, ms: 240, gain: 0.06, delay: i * 0.13 }),
      )
      break
    case 'lose':
      ;[330, 196].forEach((f, i) =>
        tone(a, { type: 'sawtooth', from: f, to: f, ms: 320, gain: 0.06, delay: i * 0.17 }),
      )
      break
  }
}
