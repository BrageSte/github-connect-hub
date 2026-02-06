import { supabase } from '@/integrations/supabase/client'
import { ConfigSnapshotItem } from '@/types/admin'

/**
 * Downloads a Fusion 360 parameter CSV for a crimp block configuration.
 * Format matches Fusion 360's "Export Parameters" CSV format exactly.
 */
type ProductionAssignment = {
  productionNumber: number
  modellId: string
}

export async function downloadFusionParameterCSV(
  item: ConfigSnapshotItem,
  orderId: string,
  assignment?: ProductionAssignment
): Promise<void> {
  const resolvedAssignment = assignment ?? await ensureProductionAssignment(orderId)
  const edgeMode = resolveEdgeMode(item.blockVariant)
  const header = 'Name,Unit,Expression,Value,Comments,Favorite'

  const rows = [
    formatRow('PekefingerBredde', item.widths.pekefinger),
    formatRow('LillefingerBredde', item.widths.lillefinger),
    formatRow('RingefingerBredde', item.widths.ringfinger),
    formatRow('LangefingerBredde', item.widths.langfinger),
    formatRow('LillefingerHoyde', item.heights.lillefinger),
    formatRow('PekefingerHoyde', item.heights.pekefinger),
    formatRow('LangefingerHoyde', item.heights.langfinger),
    formatRow('RingefingerHoyde', item.heights.ringfinger),
    formatRow('LongShort_Edge', item.blockVariant === 'longedge' ? 50 : 35),
    formatScalarRow('EdgeMode', edgeMode),
    formatTextRow('ModellID', resolvedAssignment.modellId),
  ]

  const csv = [header, ...rows].join('\n')
  downloadCSV(csv, `ExportedParameters_order_${orderId.slice(0, 8)}.csv`)
}

function formatRow(name: string, value: number): string {
  return `${name},mm,${value} mm,${value.toFixed(2)},,TRUE`
}

function formatScalarRow(name: string, value: number): string {
  return `${name},,${value},${value},,TRUE`
}

function formatTextRow(name: string, value: string): string {
  const quoted = `"${value}"`
  return `${name},,${quoted},${quoted},,TRUE`
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Downloads multiple Fusion 360 parameter CSVs with a small delay between each.
 */
export async function downloadMultipleFusionCSVs(
  orders: Array<{ item: ConfigSnapshotItem; orderId: string }>
): Promise<void> {
  const assigned: Array<{ item: ConfigSnapshotItem; orderId: string } & ProductionAssignment> = []

  for (const order of orders) {
    const assignment = await ensureProductionAssignment(order.orderId)
    assigned.push({ ...order, ...assignment })
  }

  assigned.sort((a, b) => a.productionNumber - b.productionNumber)

  for (let i = 0; i < assigned.length; i++) {
    const { item, orderId, productionNumber, modellId } = assigned[i]
    await downloadFusionParameterCSV(item, orderId, { productionNumber, modellId })
    // Small delay between downloads to avoid browser blocking
    if (i < assigned.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
}

async function ensureProductionAssignment(orderId: string): Promise<ProductionAssignment> {
  const { data, error } = await supabase
    .rpc('assign_production_number', { order_id: orderId })

  if (error || !data || data.length === 0 || !data[0]?.production_number) {
    throw new Error('Kunne ikke tildele produksjonsnummer.')
  }

  return {
    productionNumber: data[0].production_number,
    modellId: formatModelId(data[0].production_number),
  }
}

function formatModelId(productionNumber: number): string {
  return `BS-${productionNumber.toString().padStart(4, '0')}`
}

function resolveEdgeMode(variant: unknown): number {
  if (typeof variant === 'number') {
    if (variant === 0 || variant === 1) return variant
  }
  if (typeof variant === 'string') {
    const normalized = variant.toLowerCase()
    if (normalized.includes('long')) return 1
    if (normalized.includes('short')) return 0
  }
  return 0
}
