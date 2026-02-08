import { motion } from 'framer-motion'
import { Ruler, SlidersHorizontal, Package } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Ruler,
    title: 'Mål fingrene',
    description: 'Mål bredden på hver finger og avstanden mellom leddene. Vår guide viser deg nøyaktig hvordan.',
  },
  {
    number: '02',
    icon: SlidersHorizontal,
    title: 'Konfigurer',
    description: 'Bruk konfiguratoren til å sette inn målene dine. Se forhåndsvisning i sanntid.',
  },
  {
    number: '03',
    icon: Package,
    title: 'Bestill',
    description: 'Velg mellom STL-fil for egen printing eller ferdig printet blokk levert hjem.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            HVORDAN DET FUNGERER
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Fra mål til ferdig crimp block på under 5 minutter.
          </p>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 items-start"
            >
              {/* Icon container */}
              <div className="shrink-0 w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <step.icon className="w-6 h-6 text-foreground" />
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-muted-foreground/50">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
