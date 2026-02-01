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
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Slik måler du fingrene</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Følg denne guiden for å finne riktige mål til din crimp-blokk
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">1</span>
              <h3 className="font-medium text-foreground">Fingerbredde</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-10">
              Mål bredden på hver finger mellom leddene, der fingeren er bredest. Bruk en linjal eller skyvelær.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">2</span>
              <h3 className="font-medium text-foreground">Høydeforskjell</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-10">
              Legg hånden flatt på et bord. Mål forskjellen i høyde mellom toppen av hvert ledd som vist i illustrasjonen under.
            </p>
          </div>

          {/* Illustration */}
          <div className="bg-surface-light rounded-xl p-4">
            <MeasureGuide />
          </div>

          {/* Legend */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">A</span>
              <span className="text-muted-foreground">Høydeforskjell: Lille → Ring (pluss)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">B</span>
              <span className="text-muted-foreground">Høydeforskjell: Ring → Lang (pluss)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">C</span>
              <span className="text-muted-foreground">Høydeforskjell: Lang → Peke (minus)</span>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground text-sm mb-2">💡 Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Mål flere ganger for å være sikker</li>
              <li>• Bruk skyvelær for mest nøyaktige mål</li>
              <li>• Lillefinger har fast høyde på 10mm som utgangspunkt</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
