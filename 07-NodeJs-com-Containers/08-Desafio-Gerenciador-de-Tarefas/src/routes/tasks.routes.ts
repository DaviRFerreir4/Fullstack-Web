import { Router } from 'express'

import { TasksController } from '../controllers/tasks.controller'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.get('/', tasksController.index)
tasksRoutes.get('/:id/histories', tasksController.show)
tasksRoutes.post('/', tasksController.create)
tasksRoutes.put(
  '/:id',
  verifyUserAuthorization(['admin']),
  tasksController.update
)
tasksRoutes.patch('/:id', tasksController.patch)
tasksRoutes.delete('/:id', tasksController.remove)

export { tasksRoutes }
