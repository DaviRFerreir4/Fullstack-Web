import { Routes, Route } from 'react-router'

import { Home } from '../pages/Home'
import { Product } from '../pages/Product'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/products" index element={<Product />} />
    </Routes>
  )
}
