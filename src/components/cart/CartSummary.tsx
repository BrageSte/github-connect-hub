import { useCart } from '@/contexts/CartContext'
import { PICKUP_LOCATIONS } from '@/types/shop'

export default function CartSummary() {
  const { subtotal, shipping, total, itemCount, deliveryMethod, isDigitalOnly } = useCart()

  if (itemCount === 0) {
    return null
  }

  const getDeliveryLabel = () => {
    if (isDigitalOnly) return 'Digital levering'
    if (deliveryMethod === 'shipping') return 'Hjemlevering'
    const pickup = PICKUP_LOCATIONS.find(l => l.id === deliveryMethod)
    return pickup ? `Henting: ${pickup.name}` : 'Levering'
  }

  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="text-foreground">{subtotal},- kr</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{getDeliveryLabel()}</span>
        <span className={shipping === 0 ? 'text-valid font-medium' : 'text-foreground'}>
          {shipping > 0 ? `${shipping},- kr` : 'Gratis'}
        </span>
      </div>
      
      {!isDigitalOnly && deliveryMethod === 'shipping' && (
        <p className="text-xs text-muted-foreground">
          Hent gratis på Gneis Lilleaker eller Oslo Klatresenter
        </p>
      )}
      
      <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
        <span className="text-foreground">Totalt</span>
        <span className="text-primary">{total},- kr</span>
      </div>
    </div>
  )
}
