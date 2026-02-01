'use client'

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CrimpConfigurator from '@/components/configurator/CrimpConfigurator'

export default function ConfigurePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Tilbake</span>
          </Link>

          {/* Page header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Konfigurer din Stepper
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mål fingrene dine og lag en perfekt tilpasset crimp block.
            </p>
          </div>

          {/* Configurator */}
          <CrimpConfigurator />
        </div>
      </main>
      <Footer />
    </>
  )
}
