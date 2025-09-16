import { Request, Response } from 'express'

class ProductController {
  /**
   * index - GET para listar vários registros
   * show - GET para exibir um registro específico
   * create - POST para criar um registro
   * update - PUT para atualizar um registro
   * remove - DELETE para deletar um registro
   */

  index(request: Request, response: Response) {
    const { page, limit } = request.query

    if (page && limit) {
      response.send(`Página ${page} de ${limit}`)
    } else {
      response.send(`Listando produtos...`)
    }
  }

  create(request: Request, response: Response) {
    const { name, price } = request.body

    throw new Error('Erro ao tentar criar um produto')

    // response.send(`Produto ${name} custa $${price}`)
    response.status(201).json({
      name,
      price,
      user_id: request.user_id,
    })
  }
}

export { ProductController }
