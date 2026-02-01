import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/admin'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${ORDER_STATUS_COLORS[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}
