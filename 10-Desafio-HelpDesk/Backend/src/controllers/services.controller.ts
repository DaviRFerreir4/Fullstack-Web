import { Request, Response } from 'express'
import z from 'zod'

import { prisma } from '../database/prisma'
import { AppError } from '../utils/app-error'

export class ServicesController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      type: z.string().optional(),
      isActive: z.coerce.boolean().optional(),
      gt: z.coerce.number().optional(),
      lt: z.coerce.number().optional(),
      page: z.coerce.number().default(1),
      perPage: z.coerce.number().default(10),
    })

    const { type, isActive, gt, lt, page, perPage } = querySchema.parse(
      request.query
    )

    const skip = (page - 1) * perPage

    const services = await prisma.service.findMany({
      skip,
      where: {
        type: { contains: type, mode: 'insensitive' },
        isActive: { equals: isActive },
        value: { gt, lt },
      },
    })

    const totalRecords = await prisma.service.count({
      where: {
        type: { contains: type, mode: 'insensitive' },
        isActive: { equals: isActive },
        value: { gt, lt },
      },
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    return response.json({
      services,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    })
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      type: z.string({ error: 'Informe o tipo do serviço' }),
      value: z
        .number({ error: 'Informe o valor do serviço' })
        .min(1, { error: 'O valor do serviço deve ser maior que 0' }),
    })

    const { type, value } = bodySchema.parse(request.body)

    const service = await prisma.service.create({
      data: { type, value: Number(value.toFixed(2)) },
    })

    return response.status(201).json(service)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Informe um serviço válido' }),
    })

    const { id } = paramsSchema.parse(request.params)

    const service = await prisma.service.findUnique({ where: { id } })

    if (!service) {
      throw new AppError('Serviço não encontrado')
    }

    const bodySchema = z.object({
      type: z
        .string({ error: 'O tipo de serviço deve ser um texto' })
        .optional(),
      value: z
        .number({ error: 'O valor do serviço deve ser um número' })
        .min(1, { error: 'O valor do serviço deve ser maior que 0' })
        .optional(),
    })

    const { type, value } = bodySchema.parse(request.body)

    if (!type && !value) {
      throw new AppError(
        `Informe algum dado a ser atualizado (${Object.values(
          bodySchema.keyof().enum
        ).join(', ')})`
      )
    }

    const serviceUpdated = await prisma.service.update({
      where: { id },
      data: { type, value: value && Number(value.toFixed(2)) },
    })

    return response.json({ ...serviceUpdated })
  }

  async patch(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Informe um serviço válido' }),
    })

    const { id } = paramsSchema.parse(request.params)

    const service = await prisma.service.findUnique({ where: { id } })

    if (!service) {
      throw new AppError('Serviço não encontrado')
    }

    const bodySchema = z.object({
      isActive: z.boolean({
        error:
          'A informação de serviço ativo deve ser um valor boleano (true ou false)',
      }),
    })

    const { isActive } = bodySchema.parse(request.body)

    if (isActive === service.isActive) {
      throw new AppError(
        `Esse serviço já está ${service.isActive ? 'ativado' : 'desativado'}`
      )
    }

    const serviceUpdated = await prisma.service.update({
      where: { id },
      data: { isActive },
    })

    return response.json(serviceUpdated)
  }
}
