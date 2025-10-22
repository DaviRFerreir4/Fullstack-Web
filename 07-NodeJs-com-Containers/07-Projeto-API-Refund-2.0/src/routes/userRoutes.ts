import { Router } from 'express'

import { UserController } from '@/controllers/usersController.js'

const userRoutes = Router()
const userController = new UserController()

userRoutes.post('/', userController.create)

export { userRoutes }
