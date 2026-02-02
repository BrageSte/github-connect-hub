import { Check } from 'lucide-react'
import type { BlockVariant } from './StlViewer'

interface BlockOption {
  variant: BlockVariant
  name: string
  price: number
}

const BLOCK_OPTIONS: BlockOption[] = [
  {
    variant: 'shortedge',
    name: 'Short Edge',
    price: 449,
  },
  {
    variant: 'longedge',
    name: 'Long Edge',
    price: 549,
  }
]

const BLOCK_DESCRIPTIONS: Record<BlockVariant, { title: string; description: string }> = {
  shortedge: {
    title: 'Short Edge',
    description: 'Kompakt og liten. Ren løfteblokk med custom høyder til fingrene – pluss en liten kant for 3-finger drags.'
  },
  longedge: {
    title: 'Long Edge',
    description: 'Ekstra lang flate på enden (80mm), så du kan crimpe som på en vanlig 20 mm kant. Komfortabel avrunding. Dette er "ultimate"-varianten: individuelle steg med custom mål til fingrene + en vanlig 20 mm flatkant for trening.'
  }
}

interface BlockSelectorProps {
  selected: BlockVariant
  onChange: (variant: BlockVariant) => void
}

export default function BlockSelector({ selected, onChange }: BlockSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Always visible descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['shortedge', 'longedge'] as BlockVariant[]).map((variant) => (
          <div key={variant} className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">
              {BLOCK_DESCRIPTIONS[variant].title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {BLOCK_DESCRIPTIONS[variant].description}
            </p>
          </div>
        ))}
      </div>

      {/* Selection cards */}
      <div className="grid grid-cols-2 gap-4">
        {BLOCK_OPTIONS.map((option) => {
          const isSelected = selected === option.variant
          return (
            <button
              key={option.variant}
              onClick={() => onChange(option.variant)}
              className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                isSelected 
                  ? 'border-primary bg-primary/10 shadow-glow' 
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
              <div className="text-2xl font-bold text-primary">
                {option.price},-
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { BLOCK_OPTIONS, BLOCK_DESCRIPTIONS }
export type { BlockOption }
