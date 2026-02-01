import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartSummary from '@/components/cart/CartSummary'
import { useCart } from '@/contexts/CartContext'
import { redirectToMockCheckout } from '@/lib/stripe-mock'
import { useToast } from '@/hooks/use-toast'

export default function Checkout() {
  const { items, itemCount, total } = useCart()
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'vipps' | 'card'>('vipps')
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!email) {
      toast({
        title: 'E-post påkrevd',
        description: 'Vennligst oppgi e-postadressen din for å motta ordrebekreftelse.',
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)

    try {
      await redirectToMockCheckout({
        items,
        email,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`
      })
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Betalingsfeil',
        description: 'Noe gikk galt. Vennligst prøv igjen.',
        variant: 'destructive'
      })
      setIsProcessing(false)
    }
  }

  if (itemCount === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-20">
          <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold mb-4">Handlekurven er tom</h1>
            <p className="text-muted-foreground mb-8">
              Du må legge til produkter før du kan gå til kassen.
            </p>
            <Link to="/configure" className="btn-primary">
              Gå til konfigurator
            </Link>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <Link 
            to="/cart" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Tilbake til handlekurv</span>
          </Link>

          <h1 className="text-3xl font-bold mb-8">Kasse</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Kontaktinformasjon</h2>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    E-post
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din@epost.no"
                    className="w-full px-4 py-3 bg-surface-light border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Du får ordrebekreftelse og oppdateringer på denne adressen.
                  </p>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Betalingsmetode</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('vipps')}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      paymentMethod === 'vipps'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-[#FF5B24] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      V
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground">Vipps</div>
                      <div className="text-sm text-muted-foreground">Betal enkelt med Vipps</div>
                    </div>
                    {paymentMethod === 'vipps' && (
                      <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-surface-light rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground">Kort</div>
                      <div className="text-sm text-muted-foreground">Visa, Mastercard, etc.</div>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Order items preview */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Din bestilling</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-light rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-xl">🧗</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-sm truncate">
                          {item.product.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Antall: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {item.product.price * item.quantity},- kr
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Sammendrag</h2>
                <CartSummary />
                
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || !email}
                  className="btn-primary w-full justify-center mt-6 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Behandler...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'vipps' ? 'Betal med Vipps' : 'Betal med kort'}
                      <span className="ml-1">{total},- kr</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Ved å fullføre kjøpet godtar du våre{' '}
                  <Link to="/terms" className="text-primary hover:underline">vilkår</Link>
                  {' '}og{' '}
                  <Link to="/privacy" className="text-primary hover:underline">personvernerklæring</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
