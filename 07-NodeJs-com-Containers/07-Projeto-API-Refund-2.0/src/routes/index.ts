import { Router } from 'express'

import { userRoutes } from './userRoutes.js'
import { sessionsRoutes } from './sessionsRoutes.js'
import { refundsRoutes } from './refundsRoutes.js'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/refunds', refundsRoutes)

export { routes }
