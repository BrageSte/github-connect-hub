'use client'

import { useState, useEffect } from 'react'

interface ParameterSliderProps {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (value: number) => void
  description?: string
}

export default function ParameterSlider({
  label,
  value,
  min,
  max,
  unit = 'mm',
  onChange,
  description,
}: ParameterSliderProps) {
  const [inputValue, setInputValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)

  // Sync input value when prop changes
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString())
    }
  }, [value, isFocused])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    let numValue = parseInt(inputValue, 10)
    
    if (isNaN(numValue)) {
      numValue = value
    } else {
      numValue = Math.max(min, Math.min(max, numValue))
    }
    
    setInputValue(numValue.toString())
    onChange(numValue)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
  }

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      {/* Label and input */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-muted">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className="w-16 px-2 py-1 text-right text-sm font-mono bg-background border border-border rounded-lg
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                       transition-all"
          />
          <span className="text-sm text-text-muted">{unit}</span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Track background */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            {/* Filled portion */}
            <div 
              className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-100"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        
        {/* Actual slider input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="relative w-full h-5 appearance-none bg-transparent cursor-pointer z-10
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:shadow-glow
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-shadow
                     [&::-webkit-slider-thumb]:hover:shadow-glow-strong
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:bg-primary
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:border-none
                     [&::-moz-range-thumb]:shadow-glow
                     [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-text-muted">
        <span>{min}{unit}</span>
        {description && <span className="text-center">{description}</span>}
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
