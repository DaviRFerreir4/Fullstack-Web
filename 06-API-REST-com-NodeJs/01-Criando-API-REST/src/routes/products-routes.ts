import { Router } from 'express'
import myMiddleware from '../middlewares/my-middleware.js'
import { ProductController } from '../controlers/products-controller.js'

const productRoutes = Router()
const productController = new ProductController()

productRoutes.get('/', productController.index)

// Middleware local em uma rota específica
productRoutes.post('/', myMiddleware, productController.create)

export { productRoutes }
