import { useCart } from '@/contexts/CartContext'
import { PICKUP_LOCATIONS } from '@/types/shop'

export default function CartSummary() {
  const { 
    subtotal, 
    shipping, 
    total, 
    itemCount, 
    deliveryMethod, 
    isDigitalOnly,
    promoCode,
    promoDiscount,
    discountedTotal
  } = useCart()

  if (itemCount === 0) {
    return null
  }

  const getDeliveryLabel = () => {
    if (isDigitalOnly) return 'Digital levering'
    if (deliveryMethod === 'shipping') return 'Hjemlevering'
    const pickup = PICKUP_LOCATIONS.find(l => l.id === deliveryMethod)
    return pickup ? `Henting: ${pickup.name}` : 'Levering'
  }

  const getDeliveryValue = () => {
    if (!isDigitalOnly && !deliveryMethod) {
      return 'Velg metode'
    }
    return shipping > 0 ? `${shipping},- kr` : 'Gratis'
  }

  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="text-foreground">{subtotal},- kr</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{getDeliveryLabel()}</span>
        <span className={shipping === 0 && deliveryMethod ? 'text-valid font-medium' : 'text-foreground'}>
          {getDeliveryValue()}
        </span>
      </div>
      
      {!isDigitalOnly && deliveryMethod === 'shipping' && (
        <p className="text-xs text-muted-foreground">
          Hent gratis på Gneis Lilleaker eller Oslo Klatresenter
        </p>
      )}

      {/* Promo code discount */}
      {promoCode && promoDiscount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-valid font-medium">
            {promoCode} (-{Math.round(promoDiscount / total * 100)}%)
          </span>
          <span className="text-valid font-medium">-{promoDiscount},- kr</span>
        </div>
      )}
      
      <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
        <span className="text-foreground">Totalt</span>
        <div className="text-right">
          {promoDiscount > 0 && (
            <span className="text-muted-foreground line-through text-sm mr-2">{total},- kr</span>
          )}
          <span className="text-primary">{discountedTotal},- kr</span>
        </div>
      </div>
    </div>
  )
}
