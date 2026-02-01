import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Mål fingrene',
    description: 'Mål bredden på hver finger og avstanden mellom leddene. Vår guide viser deg nøyaktig hvordan.',
  },
  {
    number: '02',
    title: 'Konfigurer',
    description: 'Bruk konfiguratoren til å sette inn målene dine. Se forhåndsvisning i sanntid.',
  },
  {
    number: '03',
    title: 'Bestill',
    description: 'Velg mellom STL-fil for egen printing eller ferdig printet blokk levert hjem.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-background">
      <div className="max-w-4xl mx-auto px-6">
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

        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-8 items-start"
            >
              <div className="text-4xl font-bold text-muted-foreground/30 font-mono shrink-0">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
