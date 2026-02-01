import { supabase } from '@/integrations/supabase/client'
import { CartItem, DeliveryMethod, ShippingAddress, PICKUP_LOCATIONS } from '@/types/shop'

export interface CreateOrderParams {
  items: CartItem[]
  customerName: string
  customerEmail: string
  customerPhone?: string
  deliveryMethod: DeliveryMethod
  shippingAddress?: ShippingAddress
  promoCode?: string
  promoDiscount: number
  subtotal: number
  shipping: number
  discountedTotal: number
}

export async function createOrder(params: CreateOrderParams): Promise<string> {
  const {
    items,
    customerName,
    customerEmail,
    customerPhone,
    deliveryMethod,
    shippingAddress,
    promoCode,
    promoDiscount,
    subtotal,
    shipping,
    discountedTotal
  } = params

  // Map cart items to line_items format (prices in øre)
  const lineItems = items.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price * 100, // Convert to øre
    productId: item.product.id
  }))

  // Map to config_snapshot format
  const configSnapshot = {
    version: 1,
    items: items.map(item => ({
      productId: item.product.id,
      type: item.product.isDigital ? 'file' : 'printed',
      blockVariant: item.product.config?.blockVariant,
      widths: item.product.config?.widths,
      heights: item.product.config?.heights,
      depth: item.product.config?.depth,
      totalWidth: item.product.config?.totalWidth,
      quantity: item.quantity,
      unitPrice: item.product.price * 100
    })),
    promoCode: promoCode || null,
    promoDiscount: promoDiscount * 100 // Store in øre
  }

  // Get pickup location name if applicable
  const pickupLocation = deliveryMethod.startsWith('pickup-')
    ? PICKUP_LOCATIONS.find(loc => loc.id === deliveryMethod)?.name || null
    : null

  // Build shipping address JSON for database
  const shippingAddressJson = shippingAddress ? {
    line1: shippingAddress.line1,
    line2: shippingAddress.line2 || null,
    postalCode: shippingAddress.postalCode,
    city: shippingAddress.city
  } : null

  // Use edge function to create order (bypasses RLS issues)
  const { data, error } = await supabase.functions.invoke('create-order', {
    body: {
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      deliveryMethod,
      pickupLocation,
      shippingAddress: shippingAddressJson,
      lineItems,
      configSnapshot,
      subtotalAmount: subtotal * 100, // Convert to øre
      shippingAmount: shipping * 100, // Convert to øre
      totalAmount: discountedTotal * 100 // Convert to øre (will be 0 for free orders)
    }
  })

  if (error) {
    console.error('Error creating order:', error)
    throw new Error(`Kunne ikke opprette ordre: ${error.message}`)
  }

  if (!data?.success) {
    console.error('Order creation failed:', data?.error)
    throw new Error(data?.error || 'Kunne ikke opprette ordre')
  }

  return data.orderId
}
