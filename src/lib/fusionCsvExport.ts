import { ConfigSnapshotItem } from '@/types/admin'

/**
 * Downloads a Fusion 360 parameter CSV for a crimp block configuration.
 * Format matches Fusion 360's "Export Parameters" CSV format exactly.
 */
export function downloadFusionParameterCSV(item: ConfigSnapshotItem, orderId: string): void {
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
  ]

  const csv = [header, ...rows].join('\n')
  downloadCSV(csv, `ExportedParameters_order_${orderId.slice(0, 8)}.csv`)
}

function formatRow(name: string, value: number): string {
  return `${name},mm,${value} mm,${value.toFixed(2)},,TRUE`
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
