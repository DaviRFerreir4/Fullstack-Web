import { Routes, Route } from 'react-router'

import { Home } from '../pages/Home'
import { Product } from '../pages/Product'
import { NotFound } from '../pages/NotFound'
import { Details } from '../pages/Details'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/products" index element={<Product />} />
      <Route path="/details/:id" index element={<Details />} />
      <Route path="*" index element={<NotFound />} />
    </Routes>
  )
}
