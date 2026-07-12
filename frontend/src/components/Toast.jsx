import { useCallback, useRef, useState } from 'react'

let idCounter = 0

export function useToasts() {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback((message, variant = 'error') => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, message, variant }])
    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      delete timers.current[id]
    }, 4500)
    return id
  }, [])

  return { toasts, push, dismiss }
}

export function ToastStack({ toasts, dismiss }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast pointer-events-auto glass max-w-sm w-full sm:w-auto px-4 py-3 text-sm flex items-start gap-3 ${
            t.variant === 'error' ? 'border-danger/30' : 'border-cyan/30'
          }`}
        >
          <span
            className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
              t.variant === 'error' ? 'bg-danger' : 'bg-cyan'
            }`}
          />
          <span className="flex-1 text-fog/90">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="text-mist hover:text-fog transition-colors leading-none text-base"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
