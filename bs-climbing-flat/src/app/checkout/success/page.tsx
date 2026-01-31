'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Download, MapPin, Mail, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PICKUP_LOCATIONS } from '@/types'

interface OrderData {
  orderId: string
  stlUrl: string
  status: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const isDemo = searchParams.get('demo') === 'true'
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sessionId || isDemo) {
      // Fetch order data
      // In production, this would verify the session with Stripe
      // and retrieve the order details
      setTimeout(() => {
        const orderId = sessionId || `DEMO-${Date.now()}`
        setOrderData({
          orderId: orderId,
          stlUrl: `https://files.bsclimbing.no/orders/${orderId}/stepper.stl`,
          status: 'completed',
        })
        setIsLoading(false)
      }, 1500) // Simulated delay
    } else {
      setIsLoading(false)
    }
  }, [sessionId, isDemo])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-text-muted">Behandler bestilling...</p>
      </div>
    )
  }

  if ((!sessionId && !isDemo) || !orderData) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Ingen bestilling funnet</h1>
        <p className="text-text-muted mb-8">
          Vi fant ikke bestillingen din. Kontakt oss om du mener dette er feil.
        </p>
        <Link href="/" className="btn-primary">
          Gå til forsiden
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Demo banner */}
      {isDemo && (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
          <p className="text-yellow-500 font-medium">
            🧪 Demo-modus – ingen betaling ble behandlet
          </p>
          <p className="text-sm text-yellow-500/70 mt-1">
            Stripe er ikke konfigurert. Sett opp STRIPE_SECRET_KEY for ekte betalinger.
          </p>
        </div>
      )}

      {/* Success header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-valid/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-valid" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Takk for bestillingen!
        </h1>
        <p className="text-lg text-text-muted">
          Din Stepper er på vei 🧗
        </p>
      </div>

      {/* Order details */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="font-semibold">Ordredetaljer</h2>
          <span className="text-sm font-mono text-text-muted">
            #{orderData.orderId.slice(0, 8).toUpperCase()}
          </span>
        </div>

        <div className="space-y-4">
          {/* STL Download */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">STL-fil</h3>
                <p className="text-sm text-text-muted mb-3">
                  Din custom Stepper-fil er klar for nedlasting.
                </p>
                <a
                  href={orderData.stlUrl}
                  download
                  className="btn-primary text-sm py-2"
                >
                  Last ned STL
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Email confirmation */}
          <div className="flex items-center gap-4 p-4 bg-surface-light rounded-xl">
            <div className="w-10 h-10 bg-border rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-text-muted" />
            </div>
            <div>
              <h3 className="font-medium text-sm">E-postbekreftelse</h3>
              <p className="text-sm text-text-muted">
                En kopi er også sendt til din e-post.
              </p>
            </div>
          </div>

          {/* Pickup info */}
          <div className="flex items-start gap-4 p-4 bg-surface-light rounded-xl">
            <div className="w-10 h-10 bg-border rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-text-muted" />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-2">Henting av tau</h3>
              <p className="text-sm text-text-muted mb-2">
                Tau for montering kan hentes gratis hos:
              </p>
              <div className="space-y-2">
                {Object.values(PICKUP_LOCATIONS).map((location, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{location.name}</span>
                    <span className="text-text-muted"> – {location.address}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="card mb-8">
        <h2 className="font-semibold mb-4">Neste steg</h2>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-primary text-background rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              1
            </span>
            <span className="text-text-muted">
              Last ned STL-filen og overfør til din slicer (f.eks. PrusaSlicer, Cura)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-primary text-background rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              2
            </span>
            <span className="text-text-muted">
              Print med PLA eller PETG, 20-30% infill, 0.2mm layer height
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-primary text-background rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              3
            </span>
            <span className="text-text-muted">
              Hent tau hos et av våre utleveringssteder og monter din Stepper
            </span>
          </li>
        </ol>
      </div>

      {/* Support */}
      <div className="text-center text-sm text-text-muted">
        <p className="mb-2">
          Spørsmål? Ta kontakt på{' '}
          <a href="mailto:hei@bsclimbing.no" className="text-primary hover:underline">
            hei@bsclimbing.no
          </a>
        </p>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/" className="btn-secondary">
          Tilbake til forsiden
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="container-custom">
          <Suspense fallback={
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
