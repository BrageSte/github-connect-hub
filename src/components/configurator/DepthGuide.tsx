import { Layers } from 'lucide-react'

export default function DepthGuide() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary" />
        <h4 className="font-medium text-foreground">Dybde-alternativer</h4>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {/* 15mm - Grunn */}
        <div className="text-center flex flex-col">
          <div className="relative mx-auto w-full max-w-[60px] h-16 flex flex-col justify-end">
            <div className="h-6 bg-gradient-to-b from-primary/60 to-primary/80 rounded-t-sm" />
            <div className="h-1 bg-foreground/20 rounded-b-sm" />
          </div>
          <span className="text-sm font-mono font-semibold text-foreground mt-2">15mm</span>
          <p className="text-xs text-muted-foreground mt-1">Grunn kant</p>
          <p className="text-xs text-amber-500">Strengere</p>
        </div>

        {/* 20mm - Midt (anbefalt) */}
        <div className="text-center flex flex-col relative">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-valid/20 text-valid text-[10px] font-medium rounded-full">
            Anbefalt
          </div>
          <div className="relative mx-auto w-full max-w-[60px] h-16 flex flex-col justify-end mt-4">
            <div className="h-10 bg-gradient-to-b from-valid/60 to-valid/80 rounded-t-sm" />
            <div className="h-1 bg-foreground/20 rounded-b-sm" />
          </div>
          <span className="text-sm font-mono font-semibold text-foreground mt-2">20mm</span>
          <p className="text-xs text-muted-foreground mt-1">Midt</p>
          <p className="text-xs text-valid">Allround</p>
        </div>

        {/* 25mm - Dyp */}
        <div className="text-center flex flex-col">
          <div className="relative mx-auto w-full max-w-[60px] h-16 flex flex-col justify-end">
            <div className="h-14 bg-gradient-to-b from-blue-500/60 to-blue-500/80 rounded-t-sm" />
            <div className="h-1 bg-foreground/20 rounded-b-sm" />
          </div>
          <span className="text-sm font-mono font-semibold text-foreground mt-2">25mm</span>
          <p className="text-xs text-muted-foreground mt-1">Dyp kant</p>
          <p className="text-xs text-blue-400">Snillere</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        Mer dybde = mer hud på kanten = bedre grep og snillere for huden
      </p>
    </div>
  )
}
