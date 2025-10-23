import { Request, Response } from 'express'
import { z } from 'zod'
import { Category } from '@prisma/client'

import { prisma } from '@/database/prisma.js'
import { AppError } from '@/utils/AppError.js'

class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string({ message: 'Nome é obrigatório' }).trim(),
      category: z.enum(
        [
          Category.accomodation,
          Category.food,
          Category.others,
          Category.services,
          Category.transport,
        ],
        {
          message:
            "Categoria deve ser 'accomodation', 'food', 'services', 'transport' ou 'others'",
        }
      ),
      amount: z
        .number({ message: 'Valor é obrigatório e deve ser um número' })
        .gt(0, { message: 'Valor deve ser maior que 0' }),
      filename: z.string({ message: 'Nome do arquivo é obrigatório' }).min(20, {
        message: 'O nome do arquivo deve ser maior que 20 digitos',
      }),
    })

    const { name, category, amount, filename } = bodySchema.parse(request.body)

    if (!request.user?.id) {
      throw new AppError('Não autorizado', 401)
    }

    const refund = await prisma.refund.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id,
      },
    })

    return response.status(201).json(refund)
  }
}

export { RefundsController }
