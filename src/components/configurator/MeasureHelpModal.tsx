import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import MeasureGuide from './MeasureGuide'

interface MeasureHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MeasureHelpModal({ open, onOpenChange }: MeasureHelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Slik måler du fingrene</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Følg denne guiden for å finne riktige mål til din crimp-blokk
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tips - Read first */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground text-sm mb-2">💡 Tips før du måler (les dette først)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Bruk skyvelære for best presisjon.</li>
              <li>• Klem fingeren lett ned mot en kant (bordkant eller en vanlig crimp) når du måler. Fingerputen utvider seg litt under trykk – det er den bredden du vil ha.</li>
              <li>• Litt ekstra margin er bedre enn for tight.</li>
            </ul>
          </div>

          {/* Step 1 - Fingerbredde */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">1</span>
              <h3 className="font-medium text-foreground">Fingerbredde (mm)</h3>
            </div>
            <div className="text-sm text-muted-foreground ml-10 space-y-2">
              <p>Mål bredden på fingeren ytterst på fingerputen (der fingeren treffer kanten).</p>
              <p>Legg til 2 mm totalt (1 mm på hver side).</p>
              <p className="text-foreground/80 italic">Eksempel: 18 mm målt → skriv inn 20 mm.</p>
            </div>
          </div>

          {/* Step 2 - Høydeforskjell */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">2</span>
              <h3 className="font-medium text-foreground">Høydeforskjell (mm)</h3>
            </div>
            <div className="text-sm text-muted-foreground ml-10 space-y-2">
              <p>Lillefinger er alltid utgangspunktet (fast baseline).</p>
              <p>Du legger inn hvor mye neste finger er høyere enn den forrige:</p>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-sm ml-10 mt-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">A</span>
                <span className="text-muted-foreground">Lille → Ring</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">B</span>
                <span className="text-muted-foreground">Ring → Lang</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">C</span>
                <span className="text-muted-foreground">Lang → Peke</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground ml-10 mt-3">
              Tenk "trappetrinn": du fyller inn hvor mye hvert trinn går opp eller ned videre.
            </p>
          </div>

          {/* Illustration */}
          <div className="bg-surface-light rounded-xl p-4">
            <MeasureGuide />
          </div>

          {/* Step 3 - Dybde */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">3</span>
              <h3 className="font-medium text-foreground">Dybde</h3>
            </div>
            <div className="text-sm text-muted-foreground ml-10 space-y-2">
              <p>Dette styrer hvor mye "hud" som får plass på kanten:</p>
              <ul className="space-y-1 mt-2">
                <li><span className="text-foreground font-medium">25 mm</span> (dyp kant) = mer hud på → bedre grep / snillere</li>
                <li><span className="text-foreground font-medium">20 mm</span> (midt) = allround</li>
                <li><span className="text-foreground font-medium">15 mm</span> (grunn kant) = mindre hud på → strengere / hardere</li>
              </ul>
              <p className="mt-3 text-foreground/80 italic">Hvis du er usikker: velg 20 mm.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
