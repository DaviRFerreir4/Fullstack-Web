import { Router } from 'express'
import myMiddleware from '../middlewares/my-middleware.js'

const productRoutes = Router()

productRoutes.get('/:id', (request, response) => {
  const { id } = request.params
  const { page, limit } = request.query

  if (page && limit) {
    response.send(`Página ${page} de ${limit} | ID = ${id}`)
  } else {
    response.send(`Listando produtos... | ID = ${id}`)
  }
})

// Recuperando dados do corpo da requisição POST e utilizando um middleware local em uma rota específica
productRoutes.post('', myMiddleware, (request, response) => {
  const { name, price } = request.body

  // response.send(`Produto ${name} custa $${price}`)
  response.status(201).json({
    name,
    price,
    user_id: request.user_id,
  })
})

export { productRoutes }
