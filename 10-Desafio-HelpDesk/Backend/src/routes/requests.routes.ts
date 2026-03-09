import { Router } from 'express'

import { RequestsController } from '../controllers/requests.controller'
import { verifyUserAuthorization } from '../middlewares/verify-user-authorization'

const requestsRoutes = Router()
const requestsController = new RequestsController()

requestsRoutes.get(
  '/',
  verifyUserAuthorization(['admin']),
  requestsController.index
)
requestsRoutes.get('/:id', requestsController.show)
requestsRoutes.post(
  '/',
  verifyUserAuthorization(['client']),
  requestsController.create
)
requestsRoutes.post(
  '/:id/service',
  verifyUserAuthorization(['technician']),
  requestsController.createRequestService
)
requestsRoutes.patch(
  '/:id/service',
  verifyUserAuthorization(['technician']),
  requestsController.removeRequestService
)
requestsRoutes.post(
  '/:id',
  verifyUserAuthorization(['technician']),
  requestsController.createRequestService
)
requestsRoutes.patch(
  '/:id/status',
  verifyUserAuthorization(['technician']),
  requestsController.patchStatus
)

export { requestsRoutes }
