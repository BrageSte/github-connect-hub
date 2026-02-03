import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ProductHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Mobile: stacked, Desktop: side by side */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Text content */}
          <motion.div
            className="text-center lg:text-left order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-5 text-foreground">
              Custom crimp block
              <span className="block text-muted-foreground font-normal text-xl sm:text-2xl lg:text-3xl mt-2">
                – aktiver alle fingrene
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Flate kanter lar de sterke fingrene jukse. Med custom/unlevel får du ring + lillefinger på jobb – jevnere drag, bedre rekruttering, mer relevant styrke.
            </p>

            {/* CTA Button */}
            <Link
              to="/configure"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-all group"
            >
              Konfigurer din blokk
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Price badges */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 bg-surface border border-border px-4 py-2 rounded-full text-sm">
                STL-fil fra <span className="font-bold text-foreground">199,-</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-valid/10 border border-valid/20 px-4 py-2 rounded-full text-sm text-valid">
                Ferdig printet fra <span className="font-bold">449,-</span>
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Henting i Oslo · Frakt i hele Norge
            </p>
          </motion.div>

          {/* Product Visual */}
          <motion.div
            className="relative order-2 w-full max-w-sm lg:max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="relative aspect-square">
              {/* Product image placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-xs uppercase tracking-[0.2em]">
                  Produktbilde kommer
                </div>
                
                {/* Crimp block visualization */}
                <div className="absolute inset-0 flex items-end justify-center pb-10">
                  <div className="flex items-end gap-1.5">
                    {[
                      { h: "40%", w: "w-10 sm:w-12" },
                      { h: "52%", w: "w-10 sm:w-12" },
                      { h: "60%", w: "w-10 sm:w-12" },
                      { h: "48%", w: "w-10 sm:w-12" },
                    ].map((block, i) => (
                      <div
                        key={i}
                        className={`${block.w} bg-gradient-to-t from-muted-foreground/40 to-muted-foreground/25 rounded-t-sm`}
                        style={{ height: block.h }}
                      />
                    ))}
                  </div>
                </div>

                {/* Base */}
                <div className="absolute bottom-0 inset-x-0 h-5 bg-muted-foreground/30" />

                {/* Subtle highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-background/10 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
