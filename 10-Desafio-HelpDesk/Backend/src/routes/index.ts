import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

import { sessionsRoutes } from './sessions.routes'
import { usersRoutes } from './users.routes'
import { uploadsRoutes } from './uploads.routes'
import { servicesRoutes } from './services.routes'
import { requestsRoutes } from './requests.routes'

const routes = Router()

routes.use('/sessions', sessionsRoutes)
routes.use('/users', usersRoutes)
routes.use(ensureAuthenticated)
routes.use('/uploads', uploadsRoutes)
routes.use('/services', servicesRoutes)
routes.use('/requests', requestsRoutes)

export { routes }
