import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/types/shop'
import { useCart } from '@/contexts/CartContext'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item

  const lineTotal = product.price * quantity

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {/* Product image placeholder */}
      <div className="w-16 h-16 bg-surface-light rounded-lg flex items-center justify-center shrink-0">
        <span className="text-2xl">🧗</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-medium text-foreground text-sm truncate">
              {product.name}
            </h4>
            {product.variant && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {product.variant}
              </p>
            )}
            {product.config && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {product.config.totalWidth.toFixed(1)}mm × {product.config.depth}mm
              </p>
            )}
          </div>
          <button
            onClick={() => removeFromCart(product.id)}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Fjern fra handlekurv"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-surface-light border border-border hover:border-primary transition-colors"
              aria-label="Reduser antall"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-surface-light border border-border hover:border-primary transition-colors"
              aria-label="Øk antall"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Line total */}
          <div className="text-right">
            <span className="text-sm font-medium text-foreground">
              {lineTotal},- kr
            </span>
            {quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {product.price},- per stk
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
