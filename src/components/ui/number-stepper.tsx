import { useCallback, useRef, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumberStepperProps {
  value: number
  onChange: (value: number) => void
  onChangeComplete?: () => void
  min?: number
  max?: number
  step?: number
  size?: 'sm' | 'md'
  className?: string
}

export function NumberStepper({
  value,
  onChange,
  onChangeComplete,
  min = -Infinity,
  max = Infinity,
  step = 1,
  size = 'md',
  className
}: NumberStepperProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const didChangeRef = useRef(false)

  const increment = useCallback(() => {
    onChange(Math.min(max, value + step))
    didChangeRef.current = true
  }, [value, max, step, onChange])

  const decrement = useCallback(() => {
    onChange(Math.max(min, value - step))
    didChangeRef.current = true
  }, [value, min, step, onChange])

  const startHold = useCallback((action: () => void) => {
    didChangeRef.current = false
    action()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, 80)
    }, 400)
  }, [])

  const stopHold = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (didChangeRef.current && onChangeComplete) {
      onChangeComplete()
    }
    didChangeRef.current = false
  }, [onChangeComplete])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increment()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrement()
    }
  }

  return (
    <div
      className={cn(
        "flex items-center bg-surface-light border border-border rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-colors",
        className
      )}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        onPointerDown={(e) => { e.preventDefault(); startHold(decrement) }}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        disabled={value <= min}
        className={cn(
          size === 'sm' ? 'h-7 min-w-[1.75rem]' : 'h-10 min-w-[2.5rem]',
          "flex items-center justify-center shrink-0 text-foreground hover:text-primary hover:bg-primary/15 active:bg-primary/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-none select-none"
        )}
        aria-label="Reduser"
      >
        <Minus size={size === 'sm' ? 14 : 20} strokeWidth={2.5} />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="-?[0-9]*"
        value={value}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === '' || raw === '-') return
          const num = parseInt(raw, 10)
          if (!isNaN(num)) {
            onChange(Math.max(min, Math.min(max, num)))
          }
        }}
        className={cn(
          size === 'sm' ? 'py-1 text-xs sm:text-sm' : 'px-1 py-3 text-base',
          "flex-1 min-w-0 bg-transparent text-foreground text-center font-mono focus:outline-none"
        )}
      />

      <button
        type="button"
        onPointerDown={(e) => { e.preventDefault(); startHold(increment) }}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        disabled={value >= max}
        className={cn(
          size === 'sm' ? 'h-7 min-w-[1.75rem]' : 'h-10 min-w-[2.5rem]',
          "flex items-center justify-center shrink-0 text-foreground hover:text-primary hover:bg-primary/15 active:bg-primary/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-none select-none"
        )}
        aria-label="Øk"
      >
        <Plus size={size === 'sm' ? 14 : 20} strokeWidth={2.5} />
      </button>
    </div>
  )
}
