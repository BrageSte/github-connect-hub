import { useCart } from '@/contexts/CartContext'
import { SHIPPING_COST } from '@/types/shop'

export default function CartSummary() {
  const { subtotal, shipping, total, itemCount } = useCart()

  if (itemCount === 0) {
    return null
  }

  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="text-foreground">{subtotal},- kr</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Frakt</span>
        <span className="text-foreground">
          {shipping > 0 ? `${shipping},- kr` : 'Gratis'}
        </span>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Fast frakt {SHIPPING_COST},- kr til hele Norge
      </p>
      
      <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
        <span className="text-foreground">Totalt</span>
        <span className="text-primary">{total},- kr</span>
      </div>
    </div>
  )
}
