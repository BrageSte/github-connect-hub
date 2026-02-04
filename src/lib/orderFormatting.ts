export function formatProductionNumber(value?: number | null, width = 4): string {
  if (value === null || value === undefined) return '-'
  return value.toString().padStart(width, '0')
}
