import { Router } from 'express'
import { productRoutes } from './products-routes'
import { tablesRoutes } from './table-routes'

const routes = Router()
routes.use('/products', productRoutes)
routes.use('/tables', tablesRoutes)

export { routes }
