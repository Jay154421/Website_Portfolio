type EmptyProps = {
  title: string
  body: string
  actionLabel: string
  onAction: () => void
}

export function PanelEmpty({ title, body, actionLabel, onAction }: EmptyProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
      <h2 className="font-heading text-lg font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {actionLabel}
      </button>
    </div>
  )
}

export function PanelError({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="font-heading text-lg font-bold text-primary-800">Something went wrong</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">{message}</p>
    </div>
  )
}

export function PanelSkeleton({ label = 'Loading runs' }: { label?: string }) {
  return (
    <div aria-busy="true" aria-label={label} className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-600">{label}</p>
      <div aria-hidden="true" className="mt-4 space-y-3">
        <div className="h-4 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  )
}
