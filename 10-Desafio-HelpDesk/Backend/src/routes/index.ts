import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

import { usersRoutes } from './users.routes'

const routes = Router()

routes.use('/users', usersRoutes)
routes.use(ensureAuthenticated)

export { routes }
