import { Router } from 'express'

import { productRoutes } from './products-routes.js'

const routes = Router()

// GET simples
routes.get('/', (request, response) => {
  response.send('Hello World Express')
})

// Usa as rotas do outro arquivo passando o endereço padrão dessas rotas
routes.use('/products', productRoutes)

export { routes }
