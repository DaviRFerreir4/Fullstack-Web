import { Router } from 'express'

import { userRoutes } from './userRoutes.js'
import { sessionsRoutes } from './sessionsRoutes.js'
import { refundsRoutes } from './refundsRoutes.js'
import { uploadsRoutes } from './uploadsRoutes.js'

import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/sessions', sessionsRoutes)

routes.use(ensureAuthenticated)

routes.use('/refunds', refundsRoutes)
routes.use('/uploads', uploadsRoutes)

export { routes }
