import { Request, Response, NextFunction } from 'express'
import { knex } from '@/database/knex'
import { z } from 'zod'
import { AppError } from '@/utils/app-error'

class OrdersControllers {
  async index(request: Request, response: Response, next: NextFunction) {
    return response.json()
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number().gt(0, { message: 'quantity must be over 0' }),
      })

      const { table_session_id, product_id, quantity } = bodySchema.parse(
        request.body
      )

      const session = await knex<TablesSessionsRepository>('tables_sessions')
        .where({ id: table_session_id })
        .first()

      if (!session) {
        throw new AppError('table session not found')
      }

      if (session.closed_at) {
        throw new AppError('table is closed')
      }

      const product = await knex<ProductRepository>('products')
        .where({ id: product_id })
        .first()

      if (!product) {
        throw new AppError('product not found')
      }

      return response.status(201).json(product)
    } catch (error) {
      next(error)
    }
  }
}

export { OrdersControllers }
