import { Router } from 'express'
import { productsRoutes } from './products.routes.js'
import { sessionsRoutes } from './sessions.routes.js'

const routes = Router()

routes.use('/products', productsRoutes)
routes.use('/sessions', sessionsRoutes)

export { routes }
