'use client'

import { useState, useCallback, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import Header from '@/components/Header'
import GripEditor from '@/components/configurator/GripEditor'
import DimensionTable from '@/components/configurator/DimensionTable'
import StickySummary from '@/components/configurator/StickySummary'
import DeliveryOptions from '@/components/configurator/DeliveryOptions'
import CustomImprint from '@/components/configurator/CustomImprint'
import { 
  createDefaultGrips, 
  calculatePricing, 
  PRICING,
  type Grip, 
  type StepperConfig,
  type DeliveryOption 
} from '@/types'

// Dynamically import 3D preview to avoid SSR issues with Three.js
const Preview3D = dynamic(
  () => import('@/components/configurator/Preview3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[4/3] bg-surface rounded-xl border border-border flex items-center justify-center">
        <div className="text-text-muted">Laster preview...</div>
      </div>
    )
  }
)

export default function ConfiguratorPage() {
  // State
  const [grips, setGrips] = useState<Grip[]>(createDefaultGrips())
  const [activeGripId, setActiveGripId] = useState<number>(1)
  const [delivery, setDelivery] = useState<DeliveryOption>({ type: 'pickup', location: 'oslo-klatresenter' })
  const [customImprint, setCustomImprint] = useState({ enabled: false, text: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Computed config
  const config: StepperConfig = {
    grips,
    customImprint,
    delivery,
  }

  const pricing = calculatePricing(config)

  // Handlers
  const handleGripChange = useCallback((updatedGrip: Grip) => {
    setGrips(prev => prev.map(g => g.id === updatedGrip.id ? updatedGrip : g))
  }, [])

  const handleSelectGrip = useCallback((id: number) => {
    setActiveGripId(id)
  }, [])

  const handleDeliveryChange = useCallback((option: DeliveryOption) => {
    setDelivery(option)
  }, [])

  const handleImprintChange = useCallback((enabled: boolean, text: string) => {
    setCustomImprint({ enabled, text })
  }, [])

  const handleReset = useCallback(() => {
    setGrips(createDefaultGrips())
    setActiveGripId(1)
    setCustomImprint({ enabled: false, text: '' })
    setDelivery({ type: 'pickup', location: 'oslo-klatresenter' })
  }, [])

  const handleCheckout = async () => {
    setIsLoading(true)
    
    try {
      // Send order data to API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, pricing }),
      })
      
      const data = await response.json()
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        console.error('No checkout URL received')
        alert('Noe gikk galt. Prøv igjen.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Noe gikk galt. Prøv igjen.')
    } finally {
      setIsLoading(false)
    }
  }

  const activeGrip = grips.find(g => g.id === activeGripId)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="container-custom py-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              className="btn-ghost text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake
            </Link>
            <button
              onClick={handleReset}
              className="btn-ghost text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Nullstill
            </button>
          </div>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Konfigurer din Stepper
            </h1>
            <p className="text-text-muted">
              Juster målene på hvert grep. Se endringene i sanntid.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - 3D Preview and dimension table */}
            <div className="lg:col-span-2 space-y-6">
              {/* 3D Preview */}
              <Preview3D grips={grips} activeGripId={activeGripId} />

              {/* Grip selector tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {grips.map((grip) => (
                  <button
                    key={grip.id}
                    onClick={() => setActiveGripId(grip.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-all ${
                      activeGripId === grip.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-border-light'
                    }`}
                  >
                    <div className="text-sm font-medium">Grep {grip.id}</div>
                    <div className="text-xs text-text-muted font-mono">
                      {grip.height}×{grip.width}mm
                    </div>
                  </button>
                ))}
              </div>

              {/* Active grip editor */}
              {activeGrip && (
                <GripEditor
                  grip={activeGrip}
                  onChange={handleGripChange}
                />
              )}

              {/* Dimension table */}
              <DimensionTable
                grips={grips}
                activeGripId={activeGripId}
                onSelectGrip={handleSelectGrip}
              />

              {/* Custom imprint */}
              <CustomImprint
                enabled={customImprint.enabled}
                text={customImprint.text}
                onChange={handleImprintChange}
                price={PRICING.IMPRINT_PRICE}
              />

              {/* Delivery options */}
              <DeliveryOptions
                value={delivery}
                onChange={handleDeliveryChange}
              />
            </div>

            {/* Right column - Sticky summary */}
            <div className="lg:col-span-1">
              <StickySummary
                config={config}
                pricing={pricing}
                onCheckout={handleCheckout}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Info note */}
          <div className="mt-12 p-6 bg-surface border border-border rounded-xl">
            <h3 className="font-semibold mb-2">Om CAD-motoren</h3>
            <p className="text-sm text-text-muted">
              {/* 
                NOTE FOR DEVELOPERS:
                The CAD engine that generates the actual STL files is handled by a separate service.
                This configurator collects the parameters and sends them to the external CAD API.
                
                To integrate the CAD engine:
                1. Update the /api/order endpoint to call your CAD service
                2. The CAD service should receive the grip configurations
                3. Return the generated STL file URL
                
                See /api/order/route.ts for the integration point.
              */}
              Denne konfiguratoren sender dine mål til vår CAD-motor som genererer STL-filen. 
              Filen er optimalisert for FDM-printing med en toleranse på ±0.3mm.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
