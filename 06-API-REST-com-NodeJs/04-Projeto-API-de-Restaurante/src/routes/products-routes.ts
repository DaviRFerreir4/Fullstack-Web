import { Router } from 'express'
import { ProductController } from '@/controllers/products-controllers'

const productRoutes = Router()
const productControllers = new ProductController()

productRoutes.get('/', productControllers.index)
productRoutes.post('/', productControllers.create)
productRoutes.put('/:id', productControllers.update)

export { productRoutes }
