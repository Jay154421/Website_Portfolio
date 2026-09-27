import { useEffect, useMemo, useState } from 'react'
import { Ear, PenLine, CheckCircle2, Mic, Play, Square, RotateCcw, ArrowRight, ArrowLeft, Trophy } from 'lucide-react'
import AppLink from '@/shared/ui/AppLink'
import { readJson, writeJson } from '@/shared/lib/storage'
import { EXERCISES, LEVELS, type DictationExercise, type DictationLevel } from './exercises'
import { diffWords, feedbackFor, missedWords, scoreTranscription } from './logic'
import { SPEECH_RATES, isSpeechSupported, pickEnglishVoice, speakText, stopSpeaking, type SpeechRate } from './speech'

type Step = 1 | 2 | 3 | 4

const STEPS = [
  { n: 1 as Step, label: 'Listen', icon: Ear, hint: 'Train your ears on native speech' },
  { n: 2 as Step, label: 'Type', icon: PenLine, hint: 'Focus on sounds, spelling, grammar' },
  { n: 3 as Step, label: 'Check', icon: CheckCircle2, hint: 'Instant feedback on every word' },
  { n: 4 as Step, label: 'Speak', icon: Mic, hint: 'Shadow out loud to boost fluency' },
]

const PROGRESS_KEY = 'dictation.progress.v1'

interface ProgressEntry {
  accuracy: number
  plays: number
  at: string
}

type ProgressMap = Record<string, ProgressEntry>

const loadProgress = (): ProgressMap => readJson<ProgressMap>(PROGRESS_KEY, {})
const saveProgress = (map: ProgressMap): void => writeJson(PROGRESS_KEY, map)

function StepDots({ step }: { step: Step }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Learning steps">
      {STEPS.map((s) => {
        const Icon = s.icon
        const active = s.n === step
        const done = s.n < step
        return (
          <li
            key={s.n}
            aria-current={active ? 'step' : undefined}
            className={`rounded-lg border p-2 sm:p-3 text-center transition-colors ${
              active
                ? 'border-primary bg-primary text-white shadow-sm'
                : done
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-gray-200 bg-white text-gray-500'
            }`}
          >
            <Icon className="mx-auto h-5 w-5" aria-hidden="true" />
            <p className="mt-1 text-xs font-bold">
              {s.n}. {s.label}
            </p>
            <p className={`mt-0.5 hidden text-[11px] leading-tight sm:block ${active ? 'text-white/85' : ''}`}>
              {s.hint}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

export default function Dictation() {
  const [level, setLevel] = useState<DictationLevel>('beginner')
  const [exerciseId, setExerciseId] = useState(EXERCISES[0].id)
  const [step, setStep] = useState<Step>(1)
  const [typed, setTyped] = useState('')
  const [rate, setRate] = useState<SpeechRate>(0.8)
  const [plays, setPlays] = useState(0)
  const [progress, setProgress] = useState<ProgressMap>(loadProgress)
  const [speechReady] = useState(() => isSpeechSupported())

  const exercise: DictationExercise =
    EXERCISES.find((e) => e.id === exerciseId) ?? EXERCISES[0]

  const levelExercises = useMemo(() => EXERCISES.filter((e) => e.level === level), [level])

  const diff = useMemo(
    () => (step >= 3 ? diffWords(exercise.text, typed) : []),
    [exercise.text, typed, step],
  )
  const score = useMemo(
    () => scoreTranscription(exercise.text, typed),
    [exercise.text, typed],
  )
  const missed = useMemo(() => missedWords(diff), [diff])

  useEffect(() => {
    stopOnUnmount()
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  const stopOnUnmount = () => undefined

  const speak = (text: string) => {
    if (!speechReady) return
    const voices = window.speechSynthesis.getVoices()
    const voice = pickEnglishVoice(voices)
    speakText(window.speechSynthesis, text, rate, voice)
    setPlays((p) => p + 1)
  }

  const selectExercise = (id: string) => {
    setExerciseId(id)
    setStep(1)
    setTyped('')
    setPlays(0)
    if ('speechSynthesis' in window) stopSpeaking(window.speechSynthesis)
  }

  const selectLevel = (next: DictationLevel) => {
    setLevel(next)
    const first = EXERCISES.find((e) => e.level === next)
    if (first) selectExercise(first.id)
  }

  const submitTyping = () => {
    if (typed.trim().length === 0) return
    setStep(3)
  }

  const completeSpeaking = () => {
    const entry: ProgressEntry = {
      accuracy: score.accuracy,
      plays,
      at: new Date().toISOString(),
    }
    const next = { ...progress, [exercise.id]: entry }
    setProgress(next)
    saveProgress(next)
  }

  const nextExercise = () => {
    const idx = levelExercises.findIndex((e) => e.id === exercise.id)
    const next = levelExercises[(idx + 1) % levelExercises.length]
    selectExercise(next.id)
  }

  const completedCount = Object.keys(progress).length

  return (
    <div className="min-h-[100dvh] bg-[#FAF9F6]">
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <AppLink to="/admin" className="text-xl font-bold font-heading text-primary hover:text-primary-800 transition-colors">
            ← Admin
          </AppLink>
          <p className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <Trophy className="h-4 w-4 text-primary" aria-hidden="true" />
            {completedCount}/{EXERCISES.length} done
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Free ESL practice</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
            Daily Dictation
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Improve listening, spelling, and speaking by transcribing exactly what you hear.
            Four steps: listen, type, check, then read out loud.
          </p>
        </div>

        <div className="mt-6">
          <StepDots step={step} />
        </div>

        {/* Level tabs */}
        <div className="mt-6 flex gap-2" role="tablist" aria-label="Difficulty level">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={level === l.id}
              onClick={() => selectLevel(l.id)}
              className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                level === l.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Exercise picker */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Exercises">
          {levelExercises.map((e) => {
            const done = progress[e.id]
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => selectExercise(e.id)}
                aria-pressed={exercise.id === e.id}
                className={`min-h-[44px] shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  exercise.id === e.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                }`}
              >
                {done ? '✓ ' : ''}{e.title}
              </button>
            )
          })}
        </div>

        <section
          aria-live="polite"
          className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading text-xl font-bold text-gray-900">{exercise.title}</h2>
              <p className="text-xs text-gray-500">{exercise.hint} · Focus: {exercise.focus.join(', ')}</p>
            </div>
            <div className="flex items-center gap-2" aria-label="Playback speed">
              <span className="text-xs font-semibold text-gray-500">Speed</span>
              {SPEECH_RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRate(r)}
                  aria-pressed={rate === r}
                  className={`min-h-[36px] rounded-md border px-2.5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    rate === r ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>

          {!speechReady && (
            <p className="mt-3 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              Your browser blocks speech audio. Try Chrome or Edge for the free voice playback —
              you can still type and check below.
            </p>
          )}

          {/* STEP 1 — Listen */}
          {step === 1 && (
            <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-4 sm:p-6 text-center">
              <Ear className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <p className="mt-2 font-semibold text-gray-900">Step 1 — Listen to the audio</p>
              <p className="mt-1 text-sm text-gray-600">
                Press play as many times as you need. Start at 0.6x, then work up to 1x.
                {plays > 0 && <span className="font-semibold"> · Played {plays}x</span>}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={() => speak(exercise.text)}
                  disabled={!speechReady}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 font-bold text-white hover:bg-primary-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Play className="h-5 w-5" aria-hidden="true" /> Play audio ({rate}x)
                </button>
                <button
                  type="button"
                  onClick={() => { if ('speechSynthesis' in window) stopSpeaking(window.speechSynthesis) }}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 font-bold text-gray-700 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Square className="h-4 w-4" aria-hidden="true" /> Stop
                </button>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2"
              >
                I listened — start typing <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* STEP 2 — Type */}
          {step === 2 && (
            <div className="mt-4">
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => speak(exercise.text)}
                  disabled={!speechReady}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 text-sm font-bold text-primary hover:bg-primary/20 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Play className="h-4 w-4" aria-hidden="true" /> Replay ({plays}x played)
                </button>
              </div>
              <label htmlFor="dictation-input" className="mt-3 block text-sm font-bold text-gray-900">
                Step 2 — Type exactly what you hear
              </label>
              <textarea
                id="dictation-input"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                rows={4}
                placeholder="Type the sentence here… spelling and small words matter."
                className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-base leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-6 font-bold text-gray-700 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to listen
                </button>
                <button
                  type="button"
                  onClick={submitTyping}
                  disabled={typed.trim().length === 0}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-6 font-bold text-white hover:bg-primary-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Check my answer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Check */}
          {step === 3 && (
            <div className="mt-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-baseline gap-3">
                  <p className="font-heading text-5xl font-extrabold text-primary">{score.accuracy}%</p>
                  <p className="text-sm font-semibold text-gray-600">
                    {score.correctWords}/{score.totalWords} words correct
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-700">{feedbackFor(score)}</p>
                <p className="mt-2 flex flex-wrap gap-1.5" aria-label="Word by word result">
                  {diff.map((d, i) => (
                    <span
                      key={i}
                      title={d.status !== 'correct' ? `You: ${d.actual || '—'}` : d.expected}
                      className={`rounded px-1.5 py-0.5 text-sm font-medium ${
                        d.status === 'correct'
                          ? 'bg-green-100 text-green-900'
                          : d.status === 'extra'
                            ? 'bg-amber-100 text-amber-900 line-through'
                            : 'bg-red-100 text-red-900'
                      }`}
                    >
                      {d.expected || `+${d.actual}`}
                    </span>
                  ))}
                </p>
                {missed.length > 0 && (
                  <p className="mt-3 text-sm text-gray-700">
                    <span className="font-bold">Misheard words: </span>
                    {missed.join(', ')}
                    <span className="text-gray-500"> — replay slowly and shadow each one.</span>
                  </p>
                )}
                <details className="mt-3 text-sm">
                  <summary className="cursor-pointer font-bold text-primary">Show full transcript</summary>
                  <p className="mt-1 leading-relaxed text-gray-800">{exercise.text}</p>
                </details>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => { setTyped(''); setStep(2) }}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-6 font-bold text-gray-700 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Try again
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-6 font-bold text-white hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Continue to speaking <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Read out loud */}
          {step === 4 && (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-6 text-center">
              <Mic className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <p className="mt-2 font-bold text-gray-900">Step 4 — Read it out loud (shadowing)</p>
              <blockquote className="mx-auto mt-2 max-w-xl text-lg leading-relaxed text-gray-900">
                “{exercise.text}”
              </blockquote>
              <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
                Play the model, then say it with the same rhythm. Repeat 3x — speed and
                pronunciation grow naturally.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={() => speak(exercise.text)}
                  disabled={!speechReady}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-primary/30 bg-white px-6 font-bold text-primary hover:bg-primary/10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Play className="h-4 w-4" aria-hidden="true" /> Model pronunciation
                </button>
                <button
                  type="button"
                  onClick={() => { completeSpeaking(); nextExercise() }}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 font-bold text-white hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Done — next exercise <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => { completeSpeaking(); setStep(1) }}
                className="mt-3 text-sm font-bold text-gray-600 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2"
              >
                Save without moving on
              </button>
            </div>
          )}
        </section>

        <p className="mt-4 text-center text-xs text-gray-500">
          Free forever · No account · Voices by your browser · Progress stays on this device
        </p>
      </main>
    </div>
  )
}
