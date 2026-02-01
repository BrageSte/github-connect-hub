import { Check } from 'lucide-react'
import type { BlockVariant } from './StlViewer'

interface BlockOption {
  variant: BlockVariant
  name: string
  price: number
  description: string
}

const BLOCK_OPTIONS: BlockOption[] = [
  {
    variant: 'shortedge',
    name: 'Short Edge',
    price: 449,
    description: 'Kompakt og portabel'
  },
  {
    variant: 'longedge',
    name: 'Long Edge',
    price: 549,
    description: 'Ekstra flate for stabilitet'
  }
]

interface BlockSelectorProps {
  selected: BlockVariant
  onChange: (variant: BlockVariant) => void
}

export default function BlockSelector({ selected, onChange }: BlockSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {BLOCK_OPTIONS.map((option) => {
        const isSelected = selected === option.variant
        return (
          <button
            key={option.variant}
            onClick={() => onChange(option.variant)}
            className={`relative p-5 rounded-xl border-2 transition-all text-left ${
              isSelected 
                ? 'border-primary bg-primary/5 shadow-glow' 
                : 'border-border bg-surface-light hover:border-primary/50'
            }`}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <div className="text-lg font-semibold text-foreground mb-1">
              {option.name}
            </div>
            <div className="text-2xl font-bold text-primary mb-2">
              {option.price},-
            </div>
            <div className="text-sm text-muted-foreground">
              {option.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export { BLOCK_OPTIONS }
export type { BlockOption }
