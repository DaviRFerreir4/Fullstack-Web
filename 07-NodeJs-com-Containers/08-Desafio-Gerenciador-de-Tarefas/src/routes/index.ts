import { Router } from 'express'

import { usersRoutes } from './users-routes'
import { teamsRoutes } from './teams-routes'
import { sessionsRoutes } from './sessions-routes'

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/teams', teamsRoutes)
routes.use('/sessions', sessionsRoutes)

export { routes }
