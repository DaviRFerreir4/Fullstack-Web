import { Routes, Route, Navigate } from 'react-router'

import { UsersLayout } from '../components/layouts/UsersLayout'
import { RequestList } from '../pages/RequestList'
import { RequestDetails } from '../pages/RequestDetails'
import { TechnicianList } from '../pages/admin/TechnicianList'
import { TechnicianForm } from '../pages/admin/TechnicianForm'
import { ClientList } from '../pages/admin/ClientList'
import { ServiceList } from '../pages/admin/ServiceList'

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UsersLayout />}>
        <Route index element={<Navigate to={'/requests'} replace />} />
        <Route path="/requests" element={<RequestList />} />
        <Route path="/requests/:id" element={<RequestDetails />} />
        <Route path="/technicians" element={<TechnicianList />} />
        <Route path="/technicians/create" element={<TechnicianForm />} />
        <Route path="/technicians/:id" element={<TechnicianForm />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="*" element={<Navigate to={'/requests'} replace />} />
      </Route>
    </Routes>
  )
}
