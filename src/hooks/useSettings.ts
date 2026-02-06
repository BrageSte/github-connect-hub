import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { SiteSettings, ProductSetting, PromoCodeSetting } from '@/types/admin'

const DEFAULT_SETTINGS: SiteSettings = {
  products: [
    { variant: 'shortedge', name: 'Compact', price: 399, description: 'Ultrakompakt design tilpasset fingrene. Individuelt tilpassede steg for optimal halvkrimpp-trening.' },
    { variant: 'longedge', name: 'Long Edge', price: 499, description: 'Ekstra lang flate på enden (80mm), så du kan crimpe som på en vanlig 20 mm kant. Komfortabel avrunding. Dette er ultimate-varianten: individuelle steg med custom mål til fingrene + en vanlig 20 mm flatkant for trening.' }
  ],
  stl_file_price: 199,
  shipping_cost: 79,
  promo_codes: { 'TESTMEG': { type: 'percent', value: 100 } }
}

function parseSettings(rows: { key: string; value: unknown }[]): SiteSettings {
  const settings = { ...DEFAULT_SETTINGS }

  for (const row of rows) {
    switch (row.key) {
      case 'products':
        if (Array.isArray(row.value)) {
          settings.products = row.value as ProductSetting[]
        }
        break
      case 'stl_file_price':
        if (typeof row.value === 'number') {
          settings.stl_file_price = row.value
        }
        break
      case 'shipping_cost':
        if (typeof row.value === 'number') {
          settings.shipping_cost = row.value
        }
        break
      case 'promo_codes':
        if (row.value && typeof row.value === 'object' && !Array.isArray(row.value)) {
          settings.promo_codes = row.value as Record<string, PromoCodeSetting>
        }
        break
    }
  }

  return settings
}

export function useSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')

      if (error) throw error
      return parseSettings(data ?? [])
    },
    staleTime: 60_000 // 1 minute
  })
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value: value as never, updated_at: new Date().toISOString() })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] })
    }
  })
}

export { DEFAULT_SETTINGS }
