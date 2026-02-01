import { Package, Clock, Truck, CheckCircle2 } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import AdminLayout from '@/components/admin/AdminLayout'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const { data: orders, isLoading } = useOrders()

  const stats = {
    new: orders?.filter(o => o.status === 'new').length ?? 0,
    inProgress: orders?.filter(o => ['in_production', 'ready_to_print', 'printing'].includes(o.status)).length ?? 0,
    shipped: orders?.filter(o => o.status === 'shipped').length ?? 0,
    done: orders?.filter(o => o.status === 'done').length ?? 0
  }

  const statCards = [
    { label: 'Nye ordrer', value: stats.new, icon: Package, color: 'text-primary' },
    { label: 'I produksjon', value: stats.inProgress, icon: Clock, color: 'text-blue-400' },
    { label: 'Sendt', value: stats.shipped, icon: Truck, color: 'text-valid' },
    { label: 'Fullført', value: stats.done, icon: CheckCircle2, color: 'text-muted-foreground' }
  ]

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Oversikt over ordrer og produksjon</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold mb-1">
              {isLoading ? '–' : stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/admin/orders?status=new" 
          className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                Se nye ordrer
              </h3>
              <p className="text-sm text-muted-foreground">
                {stats.new} ordre{stats.new !== 1 ? 'r' : ''} venter på behandling
              </p>
            </div>
          </div>
        </Link>

        <Link 
          to="/admin/orders?status=in_production" 
          className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                Produksjonskø
              </h3>
              <p className="text-sm text-muted-foreground">
                {stats.inProgress} ordre{stats.inProgress !== 1 ? 'r' : ''} i produksjon
              </p>
            </div>
          </div>
        </Link>
      </div>
    </AdminLayout>
  )
}
