import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

import { UsersController } from '../controllers/users.controller'

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post('/', usersController.create)
usersRoutes.use(ensureAuthenticated)
usersRoutes.post(
  '/technician',
  verifyUserAuthorization(['admin']),
  usersController.create
)
usersRoutes.get('/', verifyUserAuthorization(['admin']), usersController.index)
usersRoutes.get('/:id', usersController.show)
usersRoutes.get('/:id/requests', usersController.showRequests)
usersRoutes.put('/:id', usersController.update)
usersRoutes.delete('/:id', usersController.remove)

export { usersRoutes }
