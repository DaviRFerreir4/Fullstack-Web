import { Router } from 'express'
import { DeliveryLogsController } from '@/controllers/delivery-logs-controllers'
import { ensureAuthenticated } from '@/middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '@/middlewares/verify-user-authorization'

const deliveryLogsRoutes = Router()
const deliveryLogsController = new DeliveryLogsController()

deliveryLogsRoutes.use(ensureAuthenticated)
deliveryLogsRoutes.get(
  '/:delivery_id/show',
  verifyUserAuthorization(['sale', 'customer']),
  deliveryLogsController.show
)
deliveryLogsRoutes.post(
  '/',
  verifyUserAuthorization(['sale']),
  deliveryLogsController.create
)

export { deliveryLogsRoutes }
