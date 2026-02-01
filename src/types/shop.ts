// Shop types for e-commerce functionality

export interface Product {
  id: string
  name: string
  description: string
  price: number // in NOK (øre for Stripe later)
  variant?: string
  image?: string
  // Custom block configuration
  config?: BlockConfig
}

export interface BlockConfig {
  blockVariant: 'shortedge' | 'longedge'
  widths: {
    lillefinger: number
    ringfinger: number
    langfinger: number
    pekefinger: number
  }
  heights: {
    lillefinger: number
    ringfinger: number
    langfinger: number
    pekefinger: number
  }
  depth: number
  totalWidth: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  orderId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  email?: string
  createdAt: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
}

export const SHIPPING_COST = 79 // Fast frakt i Norge

export function generateProductId(config: BlockConfig, orderType: 'file' | 'printed'): string {
  const { blockVariant, widths, depth } = config
  const widthSum = Object.values(widths).join('-')
  return `${orderType}-${blockVariant}-${widthSum}-${depth}-${Date.now()}`
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BS-${timestamp}-${random}`
}
