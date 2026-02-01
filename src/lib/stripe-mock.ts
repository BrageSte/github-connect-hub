// Mock Stripe Checkout for development
// Will be replaced with real Stripe integration later

import { CartItem, Order, DeliveryMethod, ShippingAddress, generateOrderId, getShippingCost, PICKUP_LOCATIONS } from '@/types/shop'

interface MockCheckoutSession {
  id: string
  url: string
}

interface CreateCheckoutParams {
  items: CartItem[]
  email?: string
  customerName?: string
  customerPhone?: string
  shippingAddress?: ShippingAddress
  deliveryMethod?: DeliveryMethod
  promoCode?: string
  promoDiscount?: number
  successUrl?: string
  cancelUrl?: string
}

// Simulates creating a Stripe Checkout Session
export async function createMockCheckoutSession(
  params: CreateCheckoutParams
): Promise<MockCheckoutSession> {
  const { 
    items, 
    email, 
    customerName,
    customerPhone,
    shippingAddress,
    deliveryMethod = 'shipping',
    promoCode,
    promoDiscount = 0
  } = params
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Create a mock session ID
  const sessionId = `mock_cs_${Date.now()}`
  
  // Store order data in sessionStorage for the success page
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = getShippingCost(items, deliveryMethod)
  const total = subtotal + shipping - promoDiscount
  
  const order: Order = {
    orderId: generateOrderId(),
    items,
    subtotal,
    shipping,
    total: Math.max(0, total),
    email,
    customerName,
    customerPhone,
    shippingAddress,
    promoCode,
    promoDiscount,
    deliveryMethod,
    createdAt: new Date().toISOString(),
    status: 'paid'
  }
  
  sessionStorage.setItem('bs-climbing-pending-order', JSON.stringify(order))
  
  return {
    id: sessionId,
    url: `/checkout/success?session_id=${sessionId}`
  }
}

// Simulates redirecting to Stripe Checkout
export async function redirectToMockCheckout(
  params: CreateCheckoutParams
): Promise<void> {
  const session = await createMockCheckoutSession(params)
  
  // Simulate the "going to Stripe" experience
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Redirect to success page
  window.location.href = session.url
}

// Retrieve the pending order from sessionStorage
export function getPendingOrder(): Order | null {
  try {
    const stored = sessionStorage.getItem('bs-climbing-pending-order')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore sessionStorage errors
  }
  return null
}

// Clear the pending order
export function clearPendingOrder(): void {
  sessionStorage.removeItem('bs-climbing-pending-order')
}

// Get delivery method label
export function getDeliveryMethodLabel(method: DeliveryMethod): string {
  if (method === 'shipping') return 'Hjemlevering'
  const pickup = PICKUP_LOCATIONS.find(l => l.id === method)
  return pickup ? `Henting: ${pickup.name}` : 'Levering'
}
