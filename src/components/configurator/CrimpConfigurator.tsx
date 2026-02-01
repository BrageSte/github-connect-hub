import { useState, useMemo } from 'react'
import MeasureGuide from './MeasureGuide'
import CrimpPreview from './CrimpPreview'
import OrderModal from './OrderModal'
import StlViewer, { type BlockVariant } from './StlViewer'
import BlockSelector, { BLOCK_OPTIONS } from './BlockSelector'

const FINGER_NAMES = ['lillefinger', 'ringfinger', 'langfinger', 'pekefinger'] as const
type FingerName = typeof FINGER_NAMES[number]

interface Widths {
  lillefinger: number
  ringfinger: number
  langfinger: number
  pekefinger: number
}

interface HeightDiffs {
  lilleToRing: number
  ringToLang: number
  langToPeke: number
}

export default function CrimpConfigurator() {
  const [blockVariant, setBlockVariant] = useState<BlockVariant>('shortedge')
  
  const [widths, setWidths] = useState<Widths>({
    lillefinger: 21,
    ringfinger: 20,
    langfinger: 21,
    pekefinger: 22
  })
  
  const [heightDiffs, setHeightDiffs] = useState<HeightDiffs>({
    lilleToRing: 5,
    ringToLang: 5,
    langToPeke: 3
  })
  
  const lilleHeight = 10
  
  const calculatedHeights = useMemo(() => {
    const ring = lilleHeight + heightDiffs.lilleToRing
    const lang = ring + heightDiffs.ringToLang
    const peke = lang - heightDiffs.langToPeke
    return {
      lillefinger: lilleHeight,
      ringfinger: ring,
      langfinger: lang,
      pekefinger: peke
    }
  }, [heightDiffs])
  
  const [depth, setDepth] = useState(20)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderType, setOrderType] = useState<'file' | 'printed' | null>(null)
  const [orderSent, setOrderSent] = useState(false)

  const totalWidth = useMemo(() => {
    const fingerWidths = Object.values(widths).reduce((sum, w) => sum + w, 0)
    return fingerWidths + 16
  }, [widths])

  const currentPrice = BLOCK_OPTIONS.find(o => o.variant === blockVariant)?.price ?? 449

  const generateOrder = (type: 'file' | 'printed') => {
    setOrderType(type)
    setShowOrderForm(true)
  }

  const handleOrderComplete = () => {
    setOrderSent(true)
    setShowOrderForm(false)
  }

  const handleReset = () => {
    setOrderSent(false)
    setShowOrderForm(false)
  }

  if (orderSent) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-valid/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-valid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Bestilling sendt!</h2>
          <p className="text-muted-foreground mb-6">Send e-posten for å fullføre bestillingen.</p>
          <button 
            onClick={handleReset}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Ny konfigurasjon
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN - Inputs */}
      <div className="space-y-6">
        {/* Block type selector */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Velg blokktype
          </h2>
          <BlockSelector selected={blockVariant} onChange={setBlockVariant} />
        </div>

        {/* 3D Preview */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            3D Forhåndsvisning
          </h2>
          <StlViewer variant={blockVariant} />
        </div>

        {/* Measure guide */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Mål mellom leddene
          </h2>
          <div className="bg-surface-light rounded-xl p-4">
            <MeasureGuide />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Mål i mm fra ledd til ledd
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN - Configuration and actions */}
      <div className="space-y-6">
        {/* Finger widths */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Fingerbredde (mm)
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {(['Lille', 'Ring', 'Lang', 'Peke'] as const).map((label, i) => {
              const finger = FINGER_NAMES[i]
              return (
                <div key={finger} className="text-center">
                  <label className="text-xs text-muted-foreground block mb-2">{label}</label>
                  <input
                    type="number"
                    min="15"
                    max="30"
                    value={widths[finger]}
                    onChange={(e) => setWidths(prev => ({...prev, [finger]: Number(e.target.value)}))}
                    className="w-full px-3 py-3 bg-surface-light border border-border rounded-lg text-foreground text-center text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Height differences */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Høydeforskjell (mm)
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-7 h-7 bg-blue-600 rounded-lg text-white text-xs flex items-center justify-center font-bold shrink-0">A</span>
              <span className="text-foreground text-sm flex-1">Lille → Ring</span>
              <input
                type="number"
                min="0"
                max="15"
                value={heightDiffs.lilleToRing}
                onChange={(e) => setHeightDiffs(prev => ({...prev, lilleToRing: Number(e.target.value)}))}
                className="w-16 px-2 py-2 bg-surface-light border border-border rounded-lg text-foreground text-center text-sm font-mono focus:border-primary focus:outline-none transition-colors"
              />
              <span className="text-muted-foreground text-sm w-16 text-right font-mono">= {calculatedHeights.ringfinger}mm</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-7 h-7 bg-blue-600 rounded-lg text-white text-xs flex items-center justify-center font-bold shrink-0">B</span>
              <span className="text-foreground text-sm flex-1">Ring → Lang</span>
              <input
                type="number"
                min="0"
                max="15"
                value={heightDiffs.ringToLang}
                onChange={(e) => setHeightDiffs(prev => ({...prev, ringToLang: Number(e.target.value)}))}
                className="w-16 px-2 py-2 bg-surface-light border border-border rounded-lg text-foreground text-center text-sm font-mono focus:border-primary focus:outline-none transition-colors"
              />
              <span className="text-muted-foreground text-sm w-16 text-right font-mono">= {calculatedHeights.langfinger}mm</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-7 h-7 bg-red-600 rounded-lg text-white text-xs flex items-center justify-center font-bold shrink-0">C</span>
              <span className="text-foreground text-sm flex-1">Lang → Peke</span>
              <input
                type="number"
                min="0"
                max="15"
                value={heightDiffs.langToPeke}
                onChange={(e) => setHeightDiffs(prev => ({...prev, langToPeke: Number(e.target.value)}))}
                className="w-16 px-2 py-2 bg-surface-light border border-border rounded-lg text-foreground text-center text-sm font-mono focus:border-red-500 focus:outline-none transition-colors"
              />
              <span className="text-muted-foreground text-sm w-16 text-right font-mono">= {calculatedHeights.pekefinger}mm</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            Lillefinger: fast 10mm (utgangspunkt)
          </p>
        </div>
        
        {/* Depth selector */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Dybde
          </h2>
          <div className="flex gap-3">
            {[15, 20, 25].map((d) => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                className={`flex-1 py-4 rounded-xl font-mono text-sm font-semibold transition-all ${
                  depth === d 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-surface-light border border-border text-foreground hover:border-primary/50'
                }`}
              >
                {d} mm
              </button>
            ))}
          </div>
        </div>

        {/* Order buttons */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Bestill
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => generateOrder('file')}
              className="p-6 bg-surface-light border border-border rounded-xl transition-all hover:border-primary/50 hover:shadow-glow text-center group"
            >
              <div className="text-foreground font-medium mb-1">3D-fil (STL)</div>
              <div className="text-2xl font-bold text-primary">199,-</div>
            </button>
            <button
              onClick={() => generateOrder('printed')}
              className="p-6 bg-surface-light border border-border rounded-xl transition-all hover:border-valid/50 text-center group"
            >
              <div className="text-foreground font-medium mb-1">Ferdig printet</div>
              <div className="text-2xl font-bold text-valid">{currentPrice},-</div>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="text-center py-4 border border-border rounded-xl bg-surface">
          <div className="text-muted-foreground text-sm mb-1">
            Valgt: <span className="text-foreground font-medium">{blockVariant === 'shortedge' ? 'Short Edge' : 'Long Edge'}</span>
          </div>
          <span className="text-muted-foreground text-sm">Beregnet totalbredde: </span>
          <span className="text-foreground font-mono font-semibold">{totalWidth.toFixed(1)}mm</span>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderForm && orderType && (
        <OrderModal
          orderType={orderType}
          blockVariant={blockVariant}
          widths={widths}
          calculatedHeights={calculatedHeights}
          depth={depth}
          totalWidth={totalWidth}
          onClose={() => setShowOrderForm(false)}
          onComplete={handleOrderComplete}
        />
      )}
    </div>
  )
}
