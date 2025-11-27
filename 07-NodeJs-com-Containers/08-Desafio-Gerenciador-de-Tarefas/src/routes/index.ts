import { Router } from 'express'

import { usersRoutes } from './users.routes'
import { teamsRoutes } from './teams.routes'
import { sessionsRoutes } from './sessions.routes'

import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

const routes = Router()

routes.use('/sessions', sessionsRoutes)
routes.use(ensureAuthenticated)
routes.use('/users', verifyUserAuthorization(['admin']), usersRoutes)
routes.use('/teams', verifyUserAuthorization(['admin']), teamsRoutes)

export { routes }
