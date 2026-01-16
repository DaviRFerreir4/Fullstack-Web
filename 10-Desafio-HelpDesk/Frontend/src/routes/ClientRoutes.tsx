import { Routes, Route, Navigate } from 'react-router'

import { UsersLayout } from '../components/layouts/UsersLayout'
import { RequestList } from '../pages/RequestList'
import { RequestDetails } from '../pages/RequestDetails'
import { RequestForm } from '../pages/client/RequestForm'

export function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UsersLayout />}>
        <Route index element={<Navigate to={'/requests'} replace />} />
        <Route path="/requests" element={<RequestList />} />
        <Route path="/requests/:id" element={<RequestDetails />} />
        <Route path="/requests/create" element={<RequestForm />} />
        <Route path="*" element={<Navigate to={'/requests'} replace />} />
      </Route>
    </Routes>
  )
}
