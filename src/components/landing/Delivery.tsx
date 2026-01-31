import { MapPin, Truck, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { PICKUP_LOCATIONS } from '@/types'

export default function Delivery() {
  return (
    <section className="section bg-surface relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container-custom relative">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            Henting & levering
          </h2>
          <p className="section-subtitle mx-auto">
            Hent gratis i Oslo, eller få det sendt.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Pickup option */}
          <motion.div 
            className="card border-valid/30"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-valid/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-valid" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold">Gratis pickup</h3>
                  <span className="px-2 py-0.5 bg-valid/20 text-valid text-xs font-medium rounded-full">
                    Anbefalt
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Hent din Stepper på et av våre utleveringssteder i Oslo
                </p>
              </div>
            </div>

            {/* Pickup locations */}
            <div className="space-y-4">
              {Object.entries(PICKUP_LOCATIONS).map(([key, location]) => (
                <div 
                  key={key}
                  className="p-4 bg-background rounded-xl border border-border"
                >
                  <div className="font-medium mb-1">{location.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{location.address}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {location.hours}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping option */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-border rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Frakt</h3>
                <p className="text-muted-foreground text-sm">
                  Vi sender til hele Norge
                </p>
              </div>
            </div>

            <div className="p-4 bg-background rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Fraktpris</span>
                <span className="font-medium">Beregnes ved checkout</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Leveringstid</span>
                <span className="text-muted-foreground">2-5 virkedager</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Tips:</span> Pickup er raskere og gratis. 
                Perfekt om du klatrer i Oslo uansett.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
