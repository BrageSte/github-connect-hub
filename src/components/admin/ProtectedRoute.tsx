import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useIsAdmin } from '@/hooks/useAdmin'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin, loading, user } = useIsAdmin()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Laster...</div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Ingen tilgang</h1>
          <p className="text-muted-foreground mb-4">Du har ikke tilgang til admin-panelet.</p>
          <a href="/" className="text-primary hover:underline">Tilbake til forsiden</a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
