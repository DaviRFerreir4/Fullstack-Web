import { Router } from 'express'
import { DeliveryLogsController } from '@/controllers/delivery-logs-controllers'
import { ensureAuthenticated } from '@/middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '@/middlewares/verify-user-authorization'

const deliveryLogsRoutes = Router()
const deliveryLogsController = new DeliveryLogsController()

deliveryLogsRoutes.use(ensureAuthenticated)
deliveryLogsRoutes.post(
  '/',
  verifyUserAuthorization(['sale']),
  deliveryLogsController.create
)

export { deliveryLogsRoutes }
