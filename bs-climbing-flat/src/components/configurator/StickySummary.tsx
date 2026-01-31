'use client'

import { ShoppingCart, Check, MapPin, Truck } from 'lucide-react'
import type { Pricing, DeliveryOption, StepperConfig } from '@/types'
import { PICKUP_LOCATIONS } from '@/types'

interface StickySummaryProps {
  pricing: Pricing
  config: StepperConfig
  onCheckout: () => void
  isLoading?: boolean
}

export default function StickySummary({ pricing, config, onCheckout, isLoading }: StickySummaryProps) {
  const deliveryLabel = config.delivery.type === 'pickup' 
    ? PICKUP_LOCATIONS[config.delivery.location].name
    : 'Frakt'

  return (
    <div className="card sticky top-24 border-primary/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h3 className="font-semibold">Din Stepper</h3>
        <div className="flex items-center gap-1 text-valid text-sm">
          <Check className="w-4 h-4" />
          <span>Klar</span>
        </div>
      </div>

      {/* Summary details */}
      <div className="space-y-3 mb-6">
        {/* Grips summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">4 grep, custom mål</span>
          <span className="font-mono">{pricing.basePrice} kr</span>
        </div>

        {/* Custom imprint */}
        {config.customImprint.enabled && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">
              Custom imprint: "{config.customImprint.text}"
            </span>
            <span className="font-mono">+{pricing.imprintPrice} kr</span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-text-muted">
            {config.delivery.type === 'pickup' ? (
              <MapPin className="w-4 h-4" />
            ) : (
              <Truck className="w-4 h-4" />
            )}
            <span>{deliveryLabel}</span>
          </div>
          <span className={`font-mono ${pricing.shippingPrice === 0 ? 'text-valid' : ''}`}>
            {pricing.shippingPrice === 0 ? 'Gratis' : `+${pricing.shippingPrice} kr`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-4 border-t border-b border-border mb-6">
        <span className="font-semibold">Totalt</span>
        <span className="text-2xl font-bold gradient-text">{pricing.total} kr</span>
      </div>

      {/* Checkout button */}
      <button
        onClick={onCheckout}
        disabled={isLoading}
        className="btn-primary w-full text-base py-4 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Behandler...
          </span>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Kjøp STL-fil
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Sikker betaling
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Stripe
        </div>
      </div>

      {/* Note */}
      <p className="mt-4 text-xs text-text-muted text-center">
        STL-filen sendes til din e-post umiddelbart etter betaling
      </p>
    </div>
  )
}
