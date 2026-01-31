'use client'

import { useState } from 'react'
import { Type, Smile } from 'lucide-react'
import { validateImprint } from '@/types'

interface CustomImprintProps {
  enabled: boolean
  text: string
  onChange: (enabled: boolean, text: string) => void
  price: number
}

export default function CustomImprint({ enabled, text, onChange, price }: CustomImprintProps) {
  const [localText, setLocalText] = useState(text)
  const validation = validateImprint(localText)
  
  // Count characters properly (emojis count as 1)
  const charCount = [...localText].length

  const handleToggle = () => {
    onChange(!enabled, localText)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    setLocalText(newText)
    
    const validation = validateImprint(newText)
    if (validation.valid) {
      onChange(enabled, newText)
    }
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Type className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Custom imprint</h3>
          </div>
          <p className="text-sm text-text-muted">
            Legg til tekst på din Stepper (maks 20 tegn, emojis tillatt 😊)
          </p>
        </div>
        
        {/* Toggle switch */}
        <button
          type="button"
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            enabled ? 'bg-primary' : 'bg-border'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Text input */}
      {enabled && (
        <div className="mt-4 pt-4 border-t border-border">
          <label className="block text-sm text-text-muted mb-2">
            Din tekst <span className="opacity-60">(emojis fungerer også!)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={localText}
              onChange={handleTextChange}
              placeholder="F.eks. NAVN 🧗 eller DATO"
              className={`input font-mono pr-16 ${
                !validation.valid ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
              {charCount}/20
            </div>
          </div>
          
          {!validation.valid && (
            <p className="mt-2 text-sm text-red-500">{validation.error}</p>
          )}

          {/* Price indicator */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-text-muted">Tillegg</span>
            <span className="font-medium text-primary">+{price} kr</span>
          </div>

          {/* Preview */}
          {localText && (
            <div className="mt-4 p-4 bg-background rounded-lg border border-border">
              <div className="text-xs text-text-muted mb-2">Preview</div>
              <div className="font-mono text-lg tracking-wider text-primary">
                {localText.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
