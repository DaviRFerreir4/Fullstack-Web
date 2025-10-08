import { Router } from 'express'
import { OrdersControllers } from '@/controllers/orders-controllers'

const ordersRoutes = Router()
const ordersControllers = new OrdersControllers()

ordersRoutes.get(
  '/table-session/:table_session_id',
  ordersControllers.indexByTableSession
)
ordersRoutes.get(
  '/table-session/:table_session_id/total',
  ordersControllers.show
)
ordersRoutes.post('/', ordersControllers.create)

export { ordersRoutes }
