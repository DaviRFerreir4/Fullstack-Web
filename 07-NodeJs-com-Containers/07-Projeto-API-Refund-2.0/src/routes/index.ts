import { Router } from 'express'

import { userRoutes } from './userRoutes.js'
import { sessionsRoutes } from './sessionsRoutes.js'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/sessions', sessionsRoutes)

export { routes }
