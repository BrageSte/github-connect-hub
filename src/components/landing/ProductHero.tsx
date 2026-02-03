import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-surface">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Product Visual - Left side, large and prominent */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Product image placeholder - styled like real product photography */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-200/70 text-xs uppercase tracking-[0.3em]">
                  Produktbilde kommer
                </div>
                {/* Crimp block visualization */}
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <div className="flex items-end gap-1">
                    {[
                      { h: "45%", w: "w-12" },
                      { h: "55%", w: "w-12" },
                      { h: "65%", w: "w-12" },
                      { h: "50%", w: "w-12" },
                    ].map((block, i) => (
                      <div
                        key={i}
                        className={`${block.w} bg-gradient-to-t from-slate-600 to-slate-500 rounded-t-sm`}
                        style={{ height: block.h }}
                      />
                    ))}
                  </div>
                </div>

                {/* Base */}
                <div className="absolute bottom-0 inset-x-0 h-6 bg-slate-600" />

                {/* Subtle reflection */}
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Text content - Right side */}
          <motion.div
            className="text-center lg:text-left order-1 lg:order-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground">
              CUSTOM CRIMP BLOCK – aktiver alle fingrene.
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
              Flate kanter lar de sterke fingrene jukse. Med custom/unlevel får du ring + lillefinger på jobb – jevnere
              drag, bedre rekruttering, mer relevant styrke.
            </p>

            <Link
              to="/configure"
              className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
            >
              KONFIGURER (60 sek)
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Fra 199,- (STL) / fra 449,- ferdig printet. Henting i Oslo eller frakt.
            </p>

            {/* Minimal specs */}
            <div className="flex gap-12 justify-center lg:justify-start mt-12 text-sm">
              <div>
                <div className="font-mono text-foreground">±0.3mm</div>
                <div className="text-muted-foreground">Toleranse</div>
              </div>
              <div>
                <div className="font-mono text-foreground">FDM</div>
                <div className="text-muted-foreground">Print-klar</div>
              </div>
              <div>
                <div className="font-mono text-foreground">4 grep</div>
                <div className="text-muted-foreground">Per blokk</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
