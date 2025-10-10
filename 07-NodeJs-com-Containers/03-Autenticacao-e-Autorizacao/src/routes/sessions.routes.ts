import { Router } from 'express'
import { SessionsControllers } from '@/controllers/sessions.controller.js'

const sessionsRoutes = Router()
const sessionsControllers = new SessionsControllers()

sessionsRoutes.post('/', sessionsControllers.create)

export { sessionsRoutes }
