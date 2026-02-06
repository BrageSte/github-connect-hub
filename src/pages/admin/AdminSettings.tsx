import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Loader2 } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useSettings, useUpdateSetting } from '@/hooks/useSettings'
import { useToast } from '@/hooks/use-toast'
import type { ProductSetting, PromoCodeSetting } from '@/types/admin'

export default function AdminSettings() {
  const { data: settings, isLoading } = useSettings()
  const updateSetting = useUpdateSetting()
  const { toast } = useToast()

  // Local state for editing
  const [products, setProducts] = useState<ProductSetting[]>([])
  const [stlFilePrice, setStlFilePrice] = useState(199)
  const [shippingCost, setShippingCost] = useState(79)
  const [promoCodes, setPromoCodes] = useState<Record<string, PromoCodeSetting>>({})
  const [newPromoCode, setNewPromoCode] = useState('')
  const [newPromoType, setNewPromoType] = useState<'percent' | 'fixed'>('percent')
  const [newPromoValue, setNewPromoValue] = useState(0)

  // Sync from server data
  useEffect(() => {
    if (settings) {
      setProducts(settings.products)
      setStlFilePrice(settings.stl_file_price)
      setShippingCost(settings.shipping_cost)
      setPromoCodes(settings.promo_codes)
    }
  }, [settings])

  const saveSetting = async (key: string, value: unknown, label: string) => {
    try {
      await updateSetting.mutateAsync({ key, value })
      toast({ title: 'Lagret', description: `${label} er oppdatert` })
    } catch {
      toast({ title: 'Feil', description: `Kunne ikke lagre ${label.toLowerCase()}`, variant: 'destructive' })
    }
  }

  const handleSaveProducts = () => {
    saveSetting('products', products, 'Produkter')
  }

  const handleSavePrices = () => {
    saveSetting('stl_file_price', stlFilePrice, 'STL-filpris')
    saveSetting('shipping_cost', shippingCost, 'Fraktkostnad')
  }

  const handleAddPromoCode = () => {
    const code = newPromoCode.toUpperCase().trim()
    if (!code) return
    const updated = { ...promoCodes, [code]: { type: newPromoType, value: newPromoValue } }
    setPromoCodes(updated)
    saveSetting('promo_codes', updated, 'Promokoder')
    setNewPromoCode('')
    setNewPromoValue(0)
  }

  const handleDeletePromoCode = (code: string) => {
    const updated = { ...promoCodes }
    delete updated[code]
    setPromoCodes(updated)
    saveSetting('promo_codes', updated, 'Promokoder')
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Innstillinger</h1>
        <p className="text-muted-foreground">Rediger produkter, priser og promokoder</p>
      </div>

      <div className="space-y-8 max-w-3xl">
        {/* Products section */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Produkter</h2>
          <div className="space-y-6">
            {products.map((product, idx) => (
              <div key={product.variant} className="space-y-3 pb-6 border-b border-border last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono bg-surface-light text-muted-foreground px-2 py-0.5 rounded">
                    {product.variant}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Navn</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => {
                        const updated = [...products]
                        updated[idx] = { ...updated[idx], name: e.target.value }
                        setProducts(updated)
                      }}
                      className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Pris (NOK)</label>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => {
                        const updated = [...products]
                        updated[idx] = { ...updated[idx], price: Number(e.target.value) }
                        setProducts(updated)
                      }}
                      className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Beskrivelse</label>
                  <textarea
                    value={product.description}
                    onChange={(e) => {
                      const updated = [...products]
                      updated[idx] = { ...updated[idx], description: e.target.value }
                      setProducts(updated)
                    }}
                    rows={3}
                    className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveProducts}
            disabled={updateSetting.isPending}
            className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lagre produkter
          </button>
        </section>

        {/* Prices section */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Priser</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">STL-fil pris (NOK)</label>
              <input
                type="number"
                value={stlFilePrice}
                onChange={(e) => setStlFilePrice(Number(e.target.value))}
                className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Fraktkostnad (NOK)</label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <button
            onClick={handleSavePrices}
            disabled={updateSetting.isPending}
            className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lagre priser
          </button>
        </section>

        {/* Promo codes section */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Promokoder</h2>

          {/* Existing codes */}
          {Object.keys(promoCodes).length > 0 && (
            <div className="space-y-2 mb-4">
              {Object.entries(promoCodes).map(([code, promo]) => (
                <div key={code} className="flex items-center justify-between bg-surface-light rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-foreground">{code}</span>
                    <span className="text-sm text-muted-foreground">
                      {promo.type === 'percent' ? `${promo.value}%` : `${promo.value} kr`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletePromoCode(code)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new code */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newPromoCode}
              onChange={(e) => setNewPromoCode(e.target.value)}
              placeholder="KODE"
              className="flex-1 bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={newPromoType}
              onChange={(e) => setNewPromoType(e.target.value as 'percent' | 'fixed')}
              className="bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="percent">Prosent (%)</option>
              <option value="fixed">Fast (kr)</option>
            </select>
            <input
              type="number"
              value={newPromoValue}
              onChange={(e) => setNewPromoValue(Number(e.target.value))}
              placeholder="Verdi"
              className="w-24 bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleAddPromoCode}
              disabled={!newPromoCode.trim()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Legg til
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
