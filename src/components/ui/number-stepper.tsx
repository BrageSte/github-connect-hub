import { useCallback, useRef, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumberStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: 'sm' | 'md'
  className?: string
}

export function NumberStepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  size = 'md',
  className
}: NumberStepperProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const increment = useCallback(() => {
    onChange(Math.min(max, value + step))
  }, [value, max, step, onChange])

  const decrement = useCallback(() => {
    onChange(Math.max(min, value - step))
  }, [value, min, step, onChange])

  const startHold = useCallback((action: () => void) => {
    action()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, 80)
    }, 400)
  }, [])

  const stopHold = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    return () => {
      stopHold()
    }
  }, [stopHold])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increment()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrement()
    }
  }

  const buttonSize = size === 'sm' ? 'w-7 h-7' : 'w-10 h-10'
  const iconSize = size === 'sm' ? 14 : 20
  const inputPadding = size === 'sm' ? 'px-0.5 py-1.5' : 'px-2 py-3'
  const fontSize = size === 'sm' ? 'text-sm' : 'text-base'
  const inputWidth = size === 'sm' ? 'min-w-[32px]' : 'min-w-[40px]'

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
        onMouseDown={() => startHold(decrement)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(decrement)}
        onTouchEnd={stopHold}
        disabled={value <= min}
        className={cn(
          buttonSize,
          "flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground hover:bg-primary/10 active:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        )}
        aria-label="Reduser"
      >
        <Minus size={iconSize} strokeWidth={2.5} />
      </button>
      
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10)
          if (!isNaN(num)) {
            onChange(Math.max(min, Math.min(max, num)))
          }
        }}
        className={cn(
          inputPadding,
          fontSize,
          inputWidth,
          "flex-1 bg-transparent text-foreground text-center font-mono focus:outline-none"
        )}
      />
      
      <button
        type="button"
        onMouseDown={() => startHold(increment)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(increment)}
        onTouchEnd={stopHold}
        disabled={value >= max}
        className={cn(
          buttonSize,
          "flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground hover:bg-primary/10 active:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        )}
        aria-label="Øk"
      >
        <Plus size={iconSize} strokeWidth={2.5} />
      </button>
    </div>
  )
}
