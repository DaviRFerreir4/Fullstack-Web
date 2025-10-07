import { Router } from 'express'
import { OrdersControllers } from '@/controllers/orders-controllers'

const ordersRoutes = Router()
const ordersControllers = new OrdersControllers()

ordersRoutes.get('/', ordersControllers.index)
ordersRoutes.post('/', ordersControllers.create)

export { ordersRoutes }
