'use client'

import ParameterSlider from './ParameterSlider'
import type { Grip } from '@/types'
import { DEFAULT_GRIP_CONSTRAINTS } from '@/types'

interface GripEditorProps {
  grip: Grip
  onChange: (grip: Grip) => void
}

export default function GripEditor({ grip, onChange }: GripEditorProps) {
  const { height, width } = DEFAULT_GRIP_CONSTRAINTS

  const handleHeightChange = (value: number) => {
    onChange({ ...grip, height: value })
  }

  const handleWidthChange = (value: number) => {
    onChange({ ...grip, width: value })
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          Grep {grip.id}
        </h3>
        <div className="text-xs text-text-muted font-mono">
          {grip.height}×{grip.width}mm
        </div>
      </div>

      <div className="space-y-6">
        {/* Height slider */}
        <ParameterSlider
          label="Høyde"
          value={grip.height}
          min={height.min}
          max={height.max}
          unit="mm"
          onChange={handleHeightChange}
          description="Grip dybde"
        />

        {/* Width slider */}
        <ParameterSlider
          label="Bredde"
          value={grip.width}
          min={width.min}
          max={width.max}
          unit="mm"
          onChange={handleWidthChange}
          description="For 4 fingre"
        />
      </div>

      {/* Quick presets */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-text-muted mr-2">Hurtigvalg høyde:</span>
          {[8, 12, 15, 20, 25].map((preset) => (
            <button
              key={preset}
              onClick={() => handleHeightChange(preset)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                grip.height === preset
                  ? 'bg-primary text-background border-primary'
                  : 'border-border text-text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {preset}mm
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
