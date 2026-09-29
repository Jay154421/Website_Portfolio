export type DictationLevel = 'beginner' | 'intermediate' | 'advanced'

export interface DictationExercise {
  id: string
  title: string
  level: DictationLevel
  text: string
  hint: string
  focus: string[]
}

export const LEVELS: { id: DictationLevel; label: string; blurb: string }[] = [
  { id: 'beginner', label: 'Beginner', blurb: 'Short, slow sentences. Everyday words.' },
  { id: 'intermediate', label: 'Intermediate', blurb: 'Contractions, connected speech, longer lines.' },
  { id: 'advanced', label: 'Advanced', blurb: 'Fast, natural speech with hidden sounds.' },
]

export const EXERCISES: DictationExercise[] = [
  {
    id: 'b1',
    title: 'Morning routine',
    level: 'beginner',
    text: 'I wake up at seven every morning and drink a glass of water.',
    hint: '13 words. Listen for the time.',
    focus: ['numbers', 'everyday verbs'],
  },
  {
    id: 'b2',
    title: 'At the market',
    level: 'beginner',
    text: 'She buys fresh apples and bread at the market on Main Street.',
    hint: '12 words. Listen for the place.',
    focus: ['plurals', 'prepositions'],
  },
  {
    id: 'b3',
    title: 'My family',
    level: 'beginner',
    text: 'My brother likes to play football with his friends after school.',
    hint: '12 words. Listen for the sport.',
    focus: ['third-person s', 'time phrases'],
  },
  {
    id: 'b4',
    title: 'Rainy day',
    level: 'beginner',
    text: 'It is raining outside, so we stay inside and read books.',
    hint: '11 words. Listen for the reason (so).',
    focus: ['contraction it is', 'conjunction so'],
  },
  {
    id: 'i1',
    title: 'Weekend plans',
    level: 'intermediate',
    text: "We're going to visit our cousins this weekend if the weather stays nice.",
    hint: '13 words. Catch the contraction at the start.',
    focus: ['contraction we are', 'conditional if'],
  },
  {
    id: 'i2',
    title: 'Missed the bus',
    level: 'intermediate',
    text: "He couldn't catch the bus, so he's running late for his English class.",
    hint: '13 words. Two contractions hide the key meaning.',
    focus: ['could not', 'present continuous'],
  },
  {
    id: 'i3',
    title: 'Coffee shop',
    level: 'intermediate',
    text: 'Could you please order a large coffee with a little extra milk?',
    hint: '12 words. Polite request with a tricky quantity.',
    focus: ['polite requests', 'a vs an'],
  },
  {
    id: 'i4',
    title: 'Study habit',
    level: 'intermediate',
    text: "I've been practicing my listening every night for about twenty minutes.",
    hint: '12 words. Present perfect continuous.',
    focus: ['I have', 'duration for'],
  },
  {
    id: 'a1',
    title: 'Fast announcement',
    level: 'advanced',
    text: "Attention passengers, the nine forty train has been delayed by fifteen minutes.",
    hint: '13 words. Numbers move fast — catch both times.',
    focus: ['numbers', 'passive voice'],
  },
  {
    id: 'a2',
    title: 'Phone message',
    level: 'advanced',
    text: "Hey, I would've called sooner, but my phone died while I was commuting home.",
    hint: '14 words. A hidden would have + past continuous.',
    focus: ['would have', 'past continuous'],
  },
  {
    id: 'a3',
    title: 'Doctor advice',
    level: 'advanced',
    text: 'You should drink plenty of water and get at least eight hours of sleep.',
    hint: '14 words. Modal + quantity + time.',
    focus: ['modal should', 'uncountable nouns'],
  },
  {
    id: 'a4',
    title: 'Job interview',
    level: 'advanced',
    text: "They'd asked me to describe a challenge I'd overcome and what I'd learned from it.",
    hint: '15 words. Three contractions of had / would.',
    focus: ['they had', 'past perfect'],
  },
]

export const exercisesByLevel = (level: DictationLevel): DictationExercise[] =>
  EXERCISES.filter((e) => e.level === level)

export const exerciseById = (id: string): DictationExercise | undefined =>
  EXERCISES.find((e) => e.id === id)
