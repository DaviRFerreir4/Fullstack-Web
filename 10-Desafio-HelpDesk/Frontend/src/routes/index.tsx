import { BrowserRouter } from 'react-router'

import { AuthRoutes } from './AuthRoutes'
import { AdminRoutes } from './AdminRoutes'
import { TechnicianRoutes } from './TechnicianRoutes'
import { ClientRoutes } from './ClientRoutes'

import { users } from '../data/users'
import { useAuth } from '../hooks/useAuth'

const user = users.find((user) => user.id === localStorage.getItem('userid'))
const role = user?.role

export function Routes() {
  const authContext = useAuth()

  console.log(authContext)

  return (
    <BrowserRouter>
      {role === 'client' ? (
        <ClientRoutes />
      ) : role === 'technician' ? (
        <TechnicianRoutes />
      ) : role === 'admin' ? (
        <AdminRoutes />
      ) : (
        <AuthRoutes />
      )}
    </BrowserRouter>
  )
}
