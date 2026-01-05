import { BrowserRouter } from 'react-router'

import { AuthRoutes } from './AuthRoutes'
import { AdminRoutes } from './AdminRoutes'

export function Routes() {
  return (
    <BrowserRouter>
      <AdminRoutes />
    </BrowserRouter>
  )
}
