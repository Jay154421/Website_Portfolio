interface PassageProps {
  target: string
  typed: string
}

// Mono keeps every glyph the same width, so the caret underline tracks the
// exact character position while colored spans mark right and wrong keys.
export default function Passage({ target, typed }: PassageProps) {
  return (
    <p className="font-mono text-lg sm:text-xl leading-loose whitespace-pre-wrap break-words text-gray-500 select-none">
      {target.split('').map((char, i) => {
        let state = ''
        if (i < typed.length) {
          state = typed[i] === char ? 'text-gray-900' : 'text-red-700 bg-red-50'
        } else if (i === typed.length) {
          state = 'text-gray-900 bg-primary/10 border-b-2 border-primary'
        }
        return (
          <span key={i} className={state}>
            {char}
          </span>
        )
      })}
    </p>
  )
}
