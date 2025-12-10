import { Router } from 'express'

import { RequestsController } from '../controllers/requests.controller'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

const requestsRoutes = Router()
const requestsController = new RequestsController()

requestsRoutes.get(
  '/:userId',
  verifyUserAuthorization(['client', 'technician']),
  requestsController.show
)
requestsRoutes.post(
  '/',
  verifyUserAuthorization(['client']),
  requestsController.create
)

export { requestsRoutes }
