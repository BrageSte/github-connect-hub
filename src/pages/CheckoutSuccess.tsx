import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Package } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { getPendingOrder, clearPendingOrder } from '@/lib/stripe-mock'
import { Order } from '@/types/shop'

export default function CheckoutSuccess() {
  const { clearCart } = useCart()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Get order data from sessionStorage
    const pendingOrder = getPendingOrder()
    if (pendingOrder) {
      setOrder(pendingOrder)
      clearPendingOrder()
      clearCart()
    }
  }, [clearCart])

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
            Vi har mottatt din bestilling og sender deg en bekreftelse på e-post.
          </p>

          {order && (
            <div className="bg-card border border-border rounded-2xl p-6 text-left mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Ordredetaljer</h2>
                <span className="text-sm font-mono text-muted-foreground">
                  #{order.orderId}
                </span>
              </div>

              {/* Order items */}
              <div className="space-y-3 mb-6">
                {order.items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-light rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-xl">🧗</span>
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
                  <span className="text-muted-foreground">Frakt</span>
                  <span>{order.shipping},- kr</span>
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
