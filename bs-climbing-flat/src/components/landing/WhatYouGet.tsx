'use client'

import { FileCode, Ruler, Package } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: FileCode,
    title: 'STL-fil klar for print',
    description: 'Optimalisert for FDM-printing. Testet og verifisert geometri. Ingen etterarbeid nødvendig på filen.',
  },
  {
    icon: Ruler,
    title: 'Dine eksakte mål',
    description: 'Hvert grep designet etter millimeterne du valgte. FDM-toleranse på ±0.3mm.',
  },
  {
    icon: Package,
    title: 'Tau inkludert',
    description: 'Tau/cord for montering følger med ved pickup. Ingen fargevalg – vi velger det som funker.',
  },
]

export default function WhatYouGet() {
  return (
    <section className="section bg-background relative">
      <div className="container-custom">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            Hva får du?
          </h2>
          <p className="section-subtitle mx-auto">
            Alt du trenger for å printe og montere din Stepper.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="card-hover text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Price callout */}
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="card bg-gradient-to-br from-surface to-surface-light border-primary/30 text-center py-10">
            <div className="text-text-muted text-sm uppercase tracking-wider mb-2">
              Fra kun
            </div>
            <div className="text-5xl md:text-6xl font-bold mb-2">
              <span className="gradient-text">199 kr</span>
            </div>
            <div className="text-text-muted mb-6">
              for STL-fil med dine mål
            </div>
            
            {/* Add-ons */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/50 rounded-full">
                <span className="text-primary">+50 kr</span>
                <span className="text-text-muted">Custom imprint</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/50 rounded-full">
                <span className="text-valid">Gratis</span>
                <span className="text-text-muted">Pickup i Oslo</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
