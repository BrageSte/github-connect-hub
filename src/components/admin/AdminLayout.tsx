import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Package, LayoutDashboard, LogOut } from 'lucide-react'
import { signOut } from '@/hooks/useAdmin'
import { useToast } from '@/hooks/use-toast'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/admin/login'
    } catch {
      toast({
        title: 'Feil',
        description: 'Kunne ikke logge ut',
        variant: 'destructive'
      })
    }
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/orders', icon: Package, label: 'Ordrer' }
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">BS</span>
            <span className="text-foreground font-medium">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-light'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-light transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logg ut</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
