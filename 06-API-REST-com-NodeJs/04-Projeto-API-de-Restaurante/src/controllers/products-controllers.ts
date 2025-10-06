import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { knex } from '@/database/knex'

class ProductController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const {name} = request.query

      const products = await knex<ProductRepository>('products').select().whereLike('name', `%${name ?? ''}%`).orderBy('name')
      
      return response.json(products)
    } catch (error) {
      next(error)
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0),
      })

      const { name, price } = bodySchema.parse(request.body)

      await knex<ProductRepository>('products').insert({ name, price })

      response.status(201).json({
        message: 'Product created succesfully!',
        product: {
          name,
          price,
        },
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ProductController }
