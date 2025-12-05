import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

import { UsersController } from '../controllers/users.controller'

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post('/', usersController.create)
usersRoutes.use(ensureAuthenticated)
usersRoutes.get('/', verifyUserAuthorization(['admin']), usersController.index)
usersRoutes.put('/:id', usersController.update)
usersRoutes.delete('/:id', usersController.remove)

export { usersRoutes }
