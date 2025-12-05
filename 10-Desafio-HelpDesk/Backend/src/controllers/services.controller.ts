import { Request, Response } from 'express'
import z from 'zod'

import { prisma } from '../database/prisma'
import { AppError } from '../utils/app-error'

export class ServicesController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      type: z.string({ error: 'Informe o tipo do serviço' }),
      value: z
        .number({ error: 'Informe o valor do serviço' })
        .min(1, { error: 'O valor do serviço deve ser maior que 0' })
        .refine((number) => {
          return Number.isInteger(number) ? number : number.toFixed(2)
        }),
    })

    const { type, value } = bodySchema.parse(request.body)

    const valueWithoutDecimal = value * 100

    await prisma.service.create({ data: { type, value: valueWithoutDecimal } })

    return response.status(201).json()
  }
}
