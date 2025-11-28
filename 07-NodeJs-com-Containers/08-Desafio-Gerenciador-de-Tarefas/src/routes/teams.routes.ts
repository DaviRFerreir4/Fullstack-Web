import { Router } from 'express'

import { TeamsController } from '../controllers/teams.controller'

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.get('/', teamsController.index)
teamsRoutes.get('/:id/members', teamsController.index)
teamsRoutes.post('/', teamsController.create)
teamsRoutes.put('/:id', teamsController.update)
teamsRoutes.delete('/:id', teamsController.remove)

export { teamsRoutes }
