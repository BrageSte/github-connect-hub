import { Link } from 'react-router-dom'
import { ShoppingBag, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/contexts/CartContext'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function CartDrawer() {
  const { items, itemCount, isCartOpen, setIsCartOpen } = useCart()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card border-l border-border flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="w-5 h-5" />
            Handlekurv
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? 'vare' : 'varer'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">
              Handlekurven er tom
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
              Konfigurer din egen Stepper for å komme i gang!
            </p>
            <Link
              to="/configure"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary"
            >
              Gå til konfigurator
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto py-2">
              {items.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {/* Summary and checkout */}
            <div className="border-t border-border pt-4 space-y-4">
              <CartSummary />
              
              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Gå til kassen
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-secondary w-full justify-center"
                >
                  Fortsett å handle
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
