import { Router } from 'express'
import { UserControllers } from '@/controllers/users-controllers'

const usersRoutes = Router()
const usersController = new UserControllers()

usersRoutes.post('/', usersController.create)

export { usersRoutes }
