// Types for the BS Climbing Stepper configurator

/**
 * Represents a single grip on the Stepper board
 * Each grip has customizable height and width in millimeters
 */
export interface Grip {
  id: number
  height: number  // mm
  width: number   // mm
}

/**
 * Configuration for the Stepper product
 */
export interface StepperConfig {
  grips: Grip[]
  customImprint: {
    enabled: boolean
    text: string  // Max 20 characters, emojis allowed
  }
  delivery: DeliveryOption
}

/**
 * Delivery options
 */
export type DeliveryOption = {
  type: 'pickup'
  location: 'oslo-klatresenter' | 'gneis'
} | {
  type: 'shipping'
  // Shipping details would be added later
}

/**
 * Pricing breakdown
 */
export interface Pricing {
  basePrice: number       // STL file price (199 kr)
  imprintPrice: number    // Custom imprint (+50 kr if enabled)
  shippingPrice: number   // 0 for pickup
  total: number
}

/**
 * Grip constraints (min/max values)
 */
export interface GripConstraints {
  height: {
    min: number
    max: number
    default: number
  }
  width: {
    min: number
    max: number
    default: number
  }
}

/**
 * Default constraints for the Stepper
 */
export const DEFAULT_GRIP_CONSTRAINTS: GripConstraints = {
  height: {
    min: 6,
    max: 35,
    default: 15,
  },
  width: {
    min: 30,
    max: 100,
    default: 50,
  },
}

/**
 * Number of grips on the Stepper (fixed at 4 for the standard model)
 */
export const GRIP_COUNT = 4

/**
 * Pricing constants
 */
export const PRICING = {
  BASE_PRICE: 199,       // STL file
  IMPRINT_PRICE: 50,     // Custom imprint
  SHIPPING_PRICE: 0,     // Placeholder - to be calculated
} as const

/**
 * Pickup locations
 */
export const PICKUP_LOCATIONS = {
  'oslo-klatresenter': {
    name: 'Oslo Klatresenter',
    address: 'Strømsveien 60, 0663 Oslo',
    hours: 'Man-Fre 10-22, Lør-Søn 10-18',
  },
  'gneis': {
    name: 'Gneis Klatresenter',
    address: 'Nydalsveien 15, 0484 Oslo',
    hours: 'Man-Fre 07-23, Lør-Søn 09-21',
  },
} as const

/**
 * FAQ item type
 */
export interface FAQItem {
  question: string
  answer: string
}
