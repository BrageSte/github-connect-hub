'use client'

import { Sliders, Eye, Download } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    icon: Sliders,
    title: 'Velg mål',
    description: 'Juster høyde og bredde på hvert grep med slidere eller skriv inn eksakte millimeter. Min 6mm, maks 35mm høyde.',
  },
  {
    number: '02',
    icon: Eye,
    title: 'Se preview',
    description: 'Se hvordan din Stepper blir i sanntid. Ingen overraskelser – du ser nøyaktig hva du får.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Kjøp STL',
    description: 'Betal, og motta STL-filen klar for din 3D-printer. Ferdig designet etter dine spesifikasjoner.',
  },
]

export default function HowItWorks() {
  return (
    <section id="hvordan" className="section bg-surface relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="container-custom relative">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            Slik funker det
          </h2>
          <p className="section-subtitle mx-auto">
            Tre steg. Ingen bullshit. Fra ide til STL på under ett minutt.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-border" />
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Step card */}
                <div className="text-center">
                  {/* Number badge */}
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-background border-2 border-border rounded-2xl flex items-center justify-center relative z-10">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    {/* Step number */}
                    <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-background text-sm font-bold rounded-full flex items-center justify-center z-20">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-border">
                      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visual demo placeholder */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="card max-w-4xl mx-auto">
            <div className="aspect-video bg-background rounded-xl flex items-center justify-center border border-border">
              {/* Placeholder for animated demo or video */}
              <div className="text-center">
                <div className="w-16 h-16 bg-surface-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-text-muted text-sm">Se konfiguratoren i aksjon</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
