import { Router } from 'express'

import { usersRoutes } from './users.routes'
import { teamsRoutes } from './teams.routes'
import { teamsMembersRoutes } from './teams-members.routes'
import { tasksRoutes } from './tasks.routes'
import { sessionsRoutes } from './sessions.routes'

import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

const routes = Router()

routes.use('/sessions', sessionsRoutes)
routes.use(ensureAuthenticated)
routes.use('/users', verifyUserAuthorization(['admin']), usersRoutes)
routes.use('/teams', verifyUserAuthorization(['admin']), teamsRoutes)
routes.use(
  '/teams-members',
  verifyUserAuthorization(['admin']),
  teamsMembersRoutes
)
routes.use('/tasks', tasksRoutes)

export { routes }
