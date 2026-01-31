'use client'

import { MapPin, Truck, Clock, Check } from 'lucide-react'
import type { DeliveryOption } from '@/types'
import { PICKUP_LOCATIONS } from '@/types'

interface DeliveryOptionsProps {
  value: DeliveryOption
  onChange: (value: DeliveryOption) => void
}

export default function DeliveryOptions({ value, onChange }: DeliveryOptionsProps) {
  const isPickup = value.type === 'pickup'

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">Levering</h3>

      <div className="space-y-3">
        {/* Pickup option */}
        <button
          type="button"
          onClick={() => onChange({ type: 'pickup', location: 'oslo-klatresenter' })}
          className={`w-full p-4 rounded-xl border text-left transition-all ${
            isPickup
              ? 'border-valid bg-valid/5'
              : 'border-border hover:border-border-light'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
              isPickup ? 'border-valid bg-valid' : 'border-border'
            }`}>
              {isPickup && <Check className="w-3 h-3 text-background" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-valid" />
                  <span className="font-medium">Gratis pickup</span>
                </div>
                <span className="text-valid text-sm font-medium">Gratis</span>
              </div>
              <p className="text-sm text-text-muted">
                Hent på Oslo Klatresenter eller Gneis
              </p>
            </div>
          </div>
        </button>

        {/* Pickup location selection */}
        {isPickup && (
          <div className="pl-8 space-y-2">
            {Object.entries(PICKUP_LOCATIONS).map(([key, location]) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ type: 'pickup', location: key as 'oslo-klatresenter' | 'gneis' })}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  value.type === 'pickup' && value.location === key
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border-light'
                }`}
              >
                <div className="font-medium text-sm">{location.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{location.address}</div>
                <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                  <Clock className="w-3 h-3" />
                  {location.hours}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Shipping option */}
        <button
          type="button"
          onClick={() => onChange({ type: 'shipping' })}
          className={`w-full p-4 rounded-xl border text-left transition-all ${
            !isPickup
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-border-light'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
              !isPickup ? 'border-primary bg-primary' : 'border-border'
            }`}>
              {!isPickup && <Check className="w-3 h-3 text-background" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-text-muted" />
                  <span className="font-medium">Frakt</span>
                </div>
                <span className="text-sm text-text-muted">Pris beregnes</span>
              </div>
              <p className="text-sm text-text-muted">
                Sendes til din adresse (2-5 virkedager)
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
