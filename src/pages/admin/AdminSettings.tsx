import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Loader2, Box, Download, Truck } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useSettings, useUpdateSetting } from '@/hooks/useSettings'
import { useToast } from '@/hooks/use-toast'
import type { ProductSetting, PromoCodeSetting } from '@/types/admin'

export default function AdminProducts() {
  const { data: settings, isLoading } = useSettings()
  const updateSetting = useUpdateSetting()
  const { toast } = useToast()

  // Local state
  const [products, setProducts] = useState<ProductSetting[]>([])
  const [stlFilePrice, setStlFilePrice] = useState(199)
  const [shippingCost, setShippingCost] = useState(79)
  const [promoCodes, setPromoCodes] = useState<Record<string, PromoCodeSetting>>({})
  const [newPromoCode, setNewPromoCode] = useState('')
  const [newPromoType, setNewPromoType] = useState<'percent' | 'fixed'>('percent')
  const [newPromoValue, setNewPromoValue] = useState(0)

  // Track unsaved changes per card
  const [dirtyProducts, setDirtyProducts] = useState<Set<string>>(new Set())
  const [dirtyStl, setDirtyStl] = useState(false)
  const [dirtyShipping, setDirtyShipping] = useState(false)

  useEffect(() => {
    if (settings) {
      setProducts(settings.products)
      setStlFilePrice(settings.stl_file_price)
      setShippingCost(settings.shipping_cost)
      setPromoCodes(settings.promo_codes)
      setDirtyProducts(new Set())
      setDirtyStl(false)
      setDirtyShipping(false)
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

  const handleSaveProduct = (variant: string) => {
    saveSetting('products', products, products.find(p => p.variant === variant)?.name ?? 'Produkt')
    setDirtyProducts(prev => { const next = new Set(prev); next.delete(variant); return next })
  }

  const handleSaveStl = () => {
    saveSetting('stl_file_price', stlFilePrice, 'STL-fil')
    setDirtyStl(false)
  }

  const handleSaveShipping = () => {
    saveSetting('shipping_cost', shippingCost, 'Frakt')
    setDirtyShipping(false)
  }

  const updateProduct = (idx: number, field: keyof ProductSetting, value: string | number) => {
    const updated = [...products]
    updated[idx] = { ...updated[idx], [field]: value }
    setProducts(updated)
    setDirtyProducts(prev => new Set(prev).add(updated[idx].variant))
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
        <h1 className="text-2xl font-bold mb-2">Produkter</h1>
        <p className="text-muted-foreground">Rediger navn, priser og beskrivelser</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Individual product cards – Compact, Long Edge */}
        {products.map((product, idx) => (
          <section key={product.variant} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Box className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <span className="text-xs font-mono text-muted-foreground">{product.variant}</span>
              </div>
              <div className="ml-auto text-2xl font-bold text-primary">{product.price},-</div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Navn</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(idx, 'name', e.target.value)}
                    className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Pris (NOK)</label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => updateProduct(idx, 'price', Number(e.target.value))}
                    className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Beskrivelse</label>
                <textarea
                  value={product.description}
                  onChange={(e) => updateProduct(idx, 'description', e.target.value)}
                  rows={3}
                  className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
            </div>

            {dirtyProducts.has(product.variant) && (
              <button
                onClick={() => handleSaveProduct(product.variant)}
                disabled={updateSetting.isPending}
                className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lagre
              </button>
            )}
          </section>
        ))}

        {/* STL File product card */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">STL-fil</h2>
              <span className="text-xs text-muted-foreground">Digital fil – alle varianter</span>
            </div>
            <div className="ml-auto text-2xl font-bold text-primary">{stlFilePrice},-</div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Pris (NOK)</label>
            <input
              type="number"
              value={stlFilePrice}
              onChange={(e) => { setStlFilePrice(Number(e.target.value)); setDirtyStl(true) }}
              className="w-full sm:w-48 bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {dirtyStl && (
            <button
              onClick={handleSaveStl}
              disabled={updateSetting.isPending}
              className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lagre
            </button>
          )}
        </section>

        {/* Shipping */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-valid/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-valid" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Frakt</h2>
              <span className="text-xs text-muted-foreground">Hjemlevering med Posten/Bring</span>
            </div>
            <div className="ml-auto text-2xl font-bold text-foreground">{shippingCost},-</div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Fraktkostnad (NOK)</label>
            <input
              type="number"
              value={shippingCost}
              onChange={(e) => { setShippingCost(Number(e.target.value)); setDirtyShipping(true) }}
              className="w-full sm:w-48 bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {dirtyShipping && (
            <button
              onClick={handleSaveShipping}
              disabled={updateSetting.isPending}
              className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lagre
            </button>
          )}
        </section>

        {/* Promo codes */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Promokoder</h2>

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
