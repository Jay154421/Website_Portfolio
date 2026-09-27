// Thin wrapper around the free Web Speech API so the UI stays testable.
// SpeechSynthesis is injected (explicit dependency) — pass a fake in tests.

export type SpeechEngine = Pick<SpeechSynthesis, 'speak' | 'cancel' | 'getVoices'> & {
  speaking?: boolean
}

export const SPEECH_RATES = [0.6, 0.8, 1] as const
export type SpeechRate = (typeof SPEECH_RATES)[number]

export function isSpeechSupported(engine?: SpeechEngine): boolean {
  if (engine) return true
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}

export function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  if (en.length === 0) return null
  const us = en.find((v) => v.lang.toLowerCase() === 'en-us')
  return us ?? en[0]
}

export function speakText(
  engine: SpeechSynthesis,
  text: string,
  rate: SpeechRate = 0.8,
  voice: SpeechSynthesisVoice | null = null,
): void {
  engine.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate
  utterance.lang = 'en-US'
  if (voice) utterance.voice = voice
  engine.speak(utterance)
}

export function stopSpeaking(engine: SpeechSynthesis): void {
  engine.cancel()
}
