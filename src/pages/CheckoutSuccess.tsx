import { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Package, Mail, MapPin, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { createOrder } from '@/lib/orderService'
import { supabase } from '@/integrations/supabase/client'
import { Order, PICKUP_LOCATIONS, isDigitalOnlyCart, CartItem } from '@/types/shop'
import { getDeliveryMethodLabel } from '@/lib/stripe-mock'

export default function CheckoutSuccess() {
  const { clearCart } = useCart()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true
    const sessionId = searchParams.get('session_id')

    const processOrder = async () => {
      try {
        // Free order flow (promo 100% off) - order already saved
        if (sessionId === 'free_order') {
          const stored = sessionStorage.getItem('bs-climbing-pending-order')
          if (stored) {
            const pendingOrder = JSON.parse(stored)
            sessionStorage.removeItem('bs-climbing-pending-order')
            if (isActive) {
              setOrder(pendingOrder)
              setLoading(false)
            }
            clearCart()
          } else {
            if (isActive) setLoading(false)
          }
          return
        }

        // Real Stripe session - verify payment
        if (!sessionId || sessionId.startsWith('mock_')) {
          // Legacy mock flow fallback
          const stored = sessionStorage.getItem('bs-climbing-pending-order')
          if (stored) {
            const pendingOrder = JSON.parse(stored)
            sessionStorage.removeItem('bs-climbing-pending-order')
            
            // Persist to database
            if (!pendingOrder.savedToDatabase && pendingOrder.customerName && pendingOrder.email) {
              const resolvedDeliveryMethod = pendingOrder.deliveryMethod ?? 'shipping'
              const orderId = await createOrder({
                items: pendingOrder.items,
                customerName: pendingOrder.customerName,
                customerEmail: pendingOrder.email,
                customerPhone: pendingOrder.customerPhone,
                deliveryMethod: resolvedDeliveryMethod,
                shippingAddress: pendingOrder.shippingAddress,
                promoCode: pendingOrder.promoCode,
                promoDiscount: pendingOrder.promoDiscount ?? 0,
                subtotal: pendingOrder.subtotal,
                shipping: pendingOrder.shipping,
                discountedTotal: pendingOrder.total,
              })
              pendingOrder.orderId = orderId
              pendingOrder.savedToDatabase = true
            }
            
            if (isActive) {
              setOrder(pendingOrder)
              setLoading(false)
            }
            clearCart()
          } else {
            if (isActive) setLoading(false)
          }
          return
        }

        // Verify Stripe session
        const { data, error: fnError } = await supabase.functions.invoke('verify-session', {
          body: { sessionId }
        })

        if (fnError || !data?.success) {
          throw new Error(data?.error || 'Kunne ikke verifisere betalingen')
        }

        // Get checkout metadata from sessionStorage
        const metaStr = sessionStorage.getItem('bs-climbing-checkout-meta')
        const meta = metaStr ? JSON.parse(metaStr) : null
        sessionStorage.removeItem('bs-climbing-checkout-meta')

        // Build cart items from metadata
        const cartItems: CartItem[] = meta?.items || data.items.map((item: any) => ({
          product: {
            id: `stripe-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: item.name,
            price: item.price,
            isDigital: item.isDigital,
            config: item.config,
          },
          quantity: item.quantity,
        }))

        const deliveryMethod = data.deliveryMethod || meta?.deliveryMethod || 'shipping'
        const subtotal = meta?.subtotal || cartItems.reduce((sum: number, i: CartItem) => sum + i.product.price * i.quantity, 0)
        const shipping = data.shippingAmount || meta?.shipping || 0

        // Save order to database
        const orderId = await createOrder({
          items: cartItems,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          deliveryMethod,
          shippingAddress: data.shippingAddress || meta?.shippingAddress,
          promoCode: data.promoCode,
          promoDiscount: data.promoDiscount || 0,
          subtotal,
          shipping,
          discountedTotal: data.totalAmount,
        })

        const newOrder: Order = {
          orderId,
          items: cartItems,
          subtotal,
          shipping,
          total: data.totalAmount,
          email: data.customerEmail,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress || meta?.shippingAddress,
          promoCode: data.promoCode,
          promoDiscount: data.promoDiscount,
          deliveryMethod,
          createdAt: new Date().toISOString(),
          status: 'paid',
          savedToDatabase: true,
        }

        if (isActive) {
          setOrder(newOrder)
          setLoading(false)
        }

        clearCart()

        // Send confirmation email (non-blocking)
        const pickupLocation = deliveryMethod.startsWith('pickup-')
          ? PICKUP_LOCATIONS.find(loc => loc.id === deliveryMethod)?.name
          : undefined

        supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId,
            siteUrl: window.location.origin,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            items: cartItems.map((item: CartItem) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            })),
            deliveryMethod,
            pickupLocation,
            shippingAddress: data.shippingAddress || meta?.shippingAddress,
            subtotal,
            shipping,
            promoDiscount: data.promoDiscount || 0,
            total: data.totalAmount,
          },
        }).catch(() => {})
      } catch (err) {
        if (import.meta.env.DEV) console.error('Checkout success error:', err)
        if (isActive) {
          setError('Noe gikk galt ved verifisering av betalingen. Kontakt oss hvis du ble belastet.')
          setLoading(false)
        }
      }
    }

    void processOrder()

    return () => { isActive = false }
  }, [clearCart, searchParams])

  const isDigitalOnly = useMemo(() => {
    if (!order) return false
    return isDigitalOnlyCart(order.items)
  }, [order])

  const pickupLocation = useMemo(() => {
    if (!order?.deliveryMethod) return null
    return PICKUP_LOCATIONS.find(l => l.id === order.deliveryMethod) || null
  }, [order])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Verifiserer betaling...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Betalingsfeil</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <a href="mailto:post@bsclimbing.no" className="text-primary hover:underline">
              Kontakt oss: post@bsclimbing.no
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-valid/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-valid" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Takk for bestillingen!</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {isDigitalOnly 
              ? 'STL-filen sendes til e-postadressen din innen få minutter.'
              : 'Vi har mottatt din bestilling og sender deg en bekreftelse på e-post.'
            }
          </p>

          {order && (
            <div className="bg-card border border-border rounded-2xl p-6 text-left mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Ordredetaljer</h2>
                <span className="text-sm font-mono text-muted-foreground">
                  #{order.orderId?.slice(0, 8)}
                </span>
              </div>

              {/* Order items */}
              <div className="space-y-3 mb-6">
                {order.items.map((item: CartItem) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-light rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-xl">{item.product.isDigital ? '📄' : '🧗'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">
                        {item.product.name}
                      </div>
                      {item.product.config && (
                        <div className="text-xs text-muted-foreground">
                          {item.product.config.totalWidth.toFixed(1)}mm × {item.product.config.depth}mm
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {item.product.price * item.quantity},- kr
                      </div>
                      <div className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order totals */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{order.subtotal},- kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.deliveryMethod ? getDeliveryMethodLabel(order.deliveryMethod) : 'Levering'}
                  </span>
                  <span className={order.shipping === 0 ? 'text-valid' : ''}>
                    {order.shipping > 0 ? `${order.shipping},- kr` : 'Gratis'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                  <span>Totalt</span>
                  <span className="text-primary">{order.total},- kr</span>
                </div>
              </div>

              {order.email && (
                <p className="text-sm text-muted-foreground mt-4">
                  Bekreftelse sendt til: <span className="text-foreground">{order.email}</span>
                </p>
              )}
            </div>
          )}

          {/* What happens next */}
          {isDigitalOnly ? (
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Digital levering</h3>
                  <p className="text-sm text-muted-foreground">
                    STL-filen sendes til e-postadressen din. Sjekk innboksen (og spam-mappen) 
                    i løpet av de neste minuttene.
                  </p>
                </div>
              </div>
            </div>
          ) : pickupLocation ? (
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-valid/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-valid" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Hent din bestilling</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Vi gir deg beskjed på e-post når bestillingen er klar for henting.
                  </p>
                  <div className="bg-surface-light rounded-lg p-3">
                    <div className="font-medium text-foreground text-sm">{pickupLocation.name}</div>
                    <div className="text-xs text-muted-foreground">{pickupLocation.address}</div>
                    {pickupLocation.description && (
                      <div className="text-xs text-muted-foreground mt-1">{pickupLocation.description}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Hva skjer nå?</h3>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    <li>1. Vi starter produksjonen av din tilpassede Stepper</li>
                    <li>2. Du får sporingsinfo på e-post når vi sender</li>
                    <li>3. Forventet leveringstid: 3-5 virkedager</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/configure" className="btn-primary">
              Lag en til
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/" className="btn-secondary">
              Tilbake til forsiden
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
