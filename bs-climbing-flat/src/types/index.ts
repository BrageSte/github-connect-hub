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
 * Order data sent to the backend
 */
export interface OrderData {
  config: StepperConfig
  pricing: Pricing
  customerEmail: string
  timestamp: string
}

/**
 * Response from the CAD API (mocked)
 * This interface defines what we expect from the external CAD service
 */
export interface CADGenerationResponse {
  success: boolean
  stlUrl?: string        // URL to download the generated STL
  previewUrl?: string    // URL to a preview image
  error?: string
}

/**
 * FAQ item type
 */
export interface FAQItem {
  question: string
  answer: string
}

/**
 * Creates default grips for initial state
 */
export function createDefaultGrips(): Grip[] {
  return Array.from({ length: GRIP_COUNT }, (_, index) => ({
    id: index + 1,
    height: DEFAULT_GRIP_CONSTRAINTS.height.default - (index * 3), // Descending heights
    width: DEFAULT_GRIP_CONSTRAINTS.width.default,
  }))
}

/**
 * Calculates total pricing based on configuration
 */
export function calculatePricing(config: StepperConfig): Pricing {
  const basePrice = PRICING.BASE_PRICE
  const imprintPrice = config.customImprint.enabled ? PRICING.IMPRINT_PRICE : 0
  const shippingPrice = config.delivery.type === 'shipping' ? PRICING.SHIPPING_PRICE : 0
  
  return {
    basePrice,
    imprintPrice,
    shippingPrice,
    total: basePrice + imprintPrice + shippingPrice,
  }
}

/**
 * Validates a grip configuration
 */
export function validateGrip(grip: Grip): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const { height, width } = DEFAULT_GRIP_CONSTRAINTS
  
  if (grip.height < height.min || grip.height > height.max) {
    errors.push(`Høyde må være mellom ${height.min}mm og ${height.max}mm`)
  }
  
  if (grip.width < width.min || grip.width > width.max) {
    errors.push(`Bredde må være mellom ${width.min}mm og ${width.max}mm`)
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validates custom imprint text
 * Allows emojis/smileys as part of the text
 */
export function validateImprint(text: string): { valid: boolean; error?: string } {
  const MAX_LENGTH = 20
  
  // Count characters properly (emojis count as 1)
  const charCount = [...text].length
  
  if (charCount > MAX_LENGTH) {
    return {
      valid: false,
      error: `Maks ${MAX_LENGTH} tegn (du har ${charCount})`,
    }
  }
  
  return { valid: true }
}
