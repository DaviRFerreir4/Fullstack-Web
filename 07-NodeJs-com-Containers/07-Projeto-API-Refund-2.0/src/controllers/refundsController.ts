import { Request, Response } from 'express'
import { z } from 'zod'
import { Category } from '@prisma/client'

import { prisma } from '@/database/prisma.js'
import { AppError } from '@/utils/AppError.js'

class RefundsController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional(),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    })

    const { name, page, perPage } = querySchema.parse(request.query)

    const skip = (page - 1) * perPage

    const refunds = await prisma.refund.findMany({
      skip,
      take: perPage,
      where: { user: { name: { contains: name?.trim() } } },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })

    const totalRecords = await prisma.refund.count({
      where: { user: { name: { contains: name?.trim() } } },
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    if (page > totalPages) {
      throw new AppError(
        `O número da página desejada é maior do que o total de páginas disponíveis. Página desejada: ${page} | Total de páginas disponíveis: ${perPage}`
      )
    }

    return response.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalPages,
        totalRecords,
      },
    })
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z
        .string({ message: 'Id é obrigatório' })
        .uuid({ message: 'Id informado não é reconhecido como um UUID' }),
    })

    const { id } = paramsSchema.parse(request.params)

    if (!request.user) {
      throw new AppError('Não autorizado', 401)
    }

    const refund = await prisma.refund.findFirst({
      where: { id },
      include: { user: true },
    })

    if (
      request.user.role === 'employee' &&
      request.user.id !== refund?.userId
    ) {
      throw new AppError('Não autorizado', 401)
    }

    return response.json(refund)
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string({ message: 'Nome é obrigatório' }).trim(),
      category: z.enum(
        [
          Category.accommodation,
          Category.food,
          Category.others,
          Category.services,
          Category.transport,
        ],
        {
          message:
            "Categoria deve ser 'accommodation', 'food', 'services', 'transport' ou 'others'",
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
