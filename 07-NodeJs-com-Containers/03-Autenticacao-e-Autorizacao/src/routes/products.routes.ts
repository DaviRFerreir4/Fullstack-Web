import { Router } from 'express'
import { ProductsControllers } from '@/controllers/products.controller.js'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js'

const productsRoutes = Router()
const productsControllers = new ProductsControllers()

// Para aplicar autorização em todas as rotas seguintes
// productsRoutes.use(verifyUserAuthorization(['sales', 'admin']))

productsRoutes.get('/', productsControllers.index)

// Autenticação e autorização em uma rota específica
productsRoutes.post(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['sale', 'admin']),
  productsControllers.create
)

export { productsRoutes }
