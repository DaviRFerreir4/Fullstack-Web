import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { knex } from '@/database/knex'
import { AppError } from '@/utils/app-error'

class ProductController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { name } = request.query

      const products = await knex<ProductRepository>('products')
        .select()
        .whereLike('name', `%${name ?? ''}%`)
        .orderBy('name')

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
        message: 'product created successfully',
        product: {
          name,
          price,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: 'id must be a number' })
        .parse(request.params.id)

      const bodySchema = z.object({
        name: z.string().trim().min(6).optional(),
        price: z.number().gt(0).optional(),
      })

      const { name, price } = bodySchema.parse(request.body)

      // Maneira que eu descobri de lidar com queries que atualizam nada
      const updatedRows = await knex<ProductRepository>('products')
        .update({ name, price, updated_at: knex.fn.now() })
        .where({ id })

      if (!updatedRows) {
        throw new AppError('product not found')
      }

      return response.json({
        message: 'product updated successfully',
        product: { id: id, name, price },
      })
    } catch (error) {
      next(error)
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: 'id must be a number' })
        .parse(request.params.id)

      // Maneira ensinada no curso de lidar com queries que atualizam nada
      const product = await knex<ProductRepository>('products')
        .select()
        .where({ id })
        .first()

      if (!product) {
        throw new AppError('product not found')
      }

      await knex<ProductRepository>('products').delete().where({ id })

      return response.json({
        message: 'product deleted successfully',
        product: { id: id },
      })
    } catch (error) {
      next(error)
    }
  }
}

export { ProductController }
