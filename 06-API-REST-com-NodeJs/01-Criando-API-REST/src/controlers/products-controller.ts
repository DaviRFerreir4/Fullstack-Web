import { Request, Response } from 'express'
// import { AppError } from '../utils/app-error.js'
import { number, z } from 'zod'

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
    const bodySchema = z.object({
      name: z.string(),
      price: z.number(),
      description: z.string().nullish(),
    })

    const { name, price, description } = bodySchema.parse(request.body)
    // Exceção muito abrangente
    // if (!name || !price) {
    //   throw new AppError('Nome e preço do produto são obrigatórios')
    // }
    // if (!name) {
    //   throw new AppError('Nome do produto é obrigatório')
    // }
    // if (name.trim().length < 5) {
    //   throw new AppError('Nome do produto deve conter mais que 5 caracteres')
    // }
    // if (!price) {
    //   throw new AppError('Preço do produto é obrigatório')
    // }
    // if (price < 0) {
    //   throw new AppError('Preço do produto deve ser maior que 0')
    // }
    // throw new AppError('Erro ao tentar criar um produto')
    // throw new Error('Erro ao tentar criar um produto')

    // response.send(`Produto ${name} custa $${price}`)
    response.status(201).json({
      name,
      price,
      user_id: request.user_id,
      description: description ?? null,
    })
  }
}

export { ProductController }
