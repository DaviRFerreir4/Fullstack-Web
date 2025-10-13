import { Router } from 'express'
import { ProductsControllers } from '@/controllers/products.controller.js'

import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'

const productsRoutes = Router()
const productsControllers = new ProductsControllers()

productsRoutes.get('/', productsControllers.index)
productsRoutes.post('/', ensureAuthenticated, productsControllers.create)

export { productsRoutes }
