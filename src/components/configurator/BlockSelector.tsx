import { Check } from 'lucide-react'
import type { BlockVariant } from './StlViewer'
import type { ProductSetting } from '@/types/admin'

interface BlockOption {
  variant: BlockVariant
  name: string
  price: number
}

const DEFAULT_BLOCK_OPTIONS: BlockOption[] = [
  {
    variant: 'shortedge',
    name: 'Compact',
    price: 399,
  },
  {
    variant: 'longedge',
    name: 'Long Edge',
    price: 499,
  }
]

const DEFAULT_BLOCK_DESCRIPTIONS: Record<BlockVariant, { title: string; description: string }> = {
  shortedge: {
    title: 'Compact',
    description: 'Ultrakompakt design tilpasset fingrene. Individuelt tilpassede steg for optimal halvkrimpp-trening.'
  },
  longedge: {
    title: 'Long Edge',
    description: 'Ekstra lang flate på enden (80mm), så du kan crimpe som på en vanlig 20 mm kant. Komfortabel avrunding. Dette er "ultimate"-varianten: individuelle steg med custom mål til fingrene + en vanlig 20 mm flatkant for trening.'
  }
}

function toBlockOptions(products?: ProductSetting[]): BlockOption[] {
  if (!products?.length) return DEFAULT_BLOCK_OPTIONS
  return products.map(p => ({ variant: p.variant, name: p.name, price: p.price }))
}

function toBlockDescriptions(products?: ProductSetting[]): Record<BlockVariant, { title: string; description: string }> {
  if (!products?.length) return DEFAULT_BLOCK_DESCRIPTIONS
  const result = { ...DEFAULT_BLOCK_DESCRIPTIONS }
  for (const p of products) {
    result[p.variant] = { title: p.name, description: p.description }
  }
  return result
}

interface BlockSelectorProps {
  selected: BlockVariant
  onChange: (variant: BlockVariant) => void
  products?: ProductSetting[]
}

export default function BlockSelector({ selected, onChange, products }: BlockSelectorProps) {
  const BLOCK_OPTIONS = toBlockOptions(products)
  const BLOCK_DESCRIPTIONS = toBlockDescriptions(products)
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

export { DEFAULT_BLOCK_OPTIONS, DEFAULT_BLOCK_DESCRIPTIONS, toBlockOptions, toBlockDescriptions }
export type { BlockOption }
