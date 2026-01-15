import { BrowserRouter } from 'react-router'

import { AuthRoutes } from './AuthRoutes'
import { AdminRoutes } from './AdminRoutes'
import { TechnicianRoutes } from './TechnicianRoutes'
import { ClientRoutes } from './ClientRoutes'

import { users } from '../data/users'

const user = users.find((user) => user.id === localStorage.getItem('userid'))
const role = user?.role

export function Routes() {
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
