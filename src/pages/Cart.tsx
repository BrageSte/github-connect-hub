import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { useCart } from '@/contexts/CartContext'

export default function Cart() {
  const { items, itemCount } = useCart()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Handlekurv</h1>

          {items.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Handlekurven er tom</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Det ser ut som du ikke har lagt til noe ennå. 
                Konfigurer din egen Stepper for å komme i gang!
              </p>
              <Link to="/configure" className="btn-primary">
                Gå til konfigurator
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                  {itemCount} {itemCount === 1 ? 'vare' : 'varer'}
                </h2>
                <div className="divide-y divide-border">
                  {items.map(item => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Summary sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Sammendrag</h2>
                  <CartSummary />
                  <div className="mt-6 space-y-3">
                    <Link to="/checkout" className="btn-primary w-full justify-center">
                      Gå til kassen
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/configure" className="btn-secondary w-full justify-center">
                      Legg til flere
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
