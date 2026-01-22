import { BrowserRouter } from 'react-router'

import { AuthRoutes } from './AuthRoutes'
import { AdminRoutes } from './AdminRoutes'
import { TechnicianRoutes } from './TechnicianRoutes'
import { ClientRoutes } from './ClientRoutes'

import { useAuth } from '../hooks/useAuth'

export function Routes() {
  const { session } = useAuth()

  function Route() {
    switch (session?.user.role) {
      case 'client':
        return <ClientRoutes />
      case 'technician':
        return <TechnicianRoutes />
      case 'admin':
        return <AdminRoutes />
      default:
        return <AuthRoutes />
    }
  }

  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  )
}
