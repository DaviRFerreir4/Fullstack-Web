import { Router } from 'express'
import { questionsRoutes } from './questions-routes.js'
import { usersRoutes } from './users-routes.js'

const routes = Router()

routes.use('/questions', questionsRoutes)
routes.use('/users', usersRoutes)

export { routes }
