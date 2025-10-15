import { Router } from 'express'
import { DeliveriesController } from '@/controllers/deliveries-controllers'
import { DeliveriesStatusController } from '@/controllers/deliveries-status-controllers'
import { ensureAuthenticated } from '@/middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '@/middlewares/verify-user-authorization'

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()
const deliveriesStatusController = new DeliveriesStatusController()

deliveriesRoutes.use(ensureAuthenticated, verifyUserAuthorization(['sale']))
deliveriesRoutes.get('/', deliveriesController.index)
deliveriesRoutes.post('/', deliveriesController.create)
deliveriesRoutes.patch('/:id/status', deliveriesStatusController.update)

export { deliveriesRoutes }
