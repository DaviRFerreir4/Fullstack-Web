import { Request, Response } from 'express'
import z from 'zod'

import { prisma } from '../database/prisma'
import { AppError } from '../../utils/app-error'

export class TeamsController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z
        .string({ error: 'Name is required' })
        .max(100, { error: "Name can't be over 100 digits" })
        .optional(),
    })

    const { name } = querySchema.parse(request.query)

    const teams = await prisma.team.findMany({
      where: { name: { contains: name } },
    })

    response.json(teams)
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string({ error: 'Name is required' })
        .max(100, { error: "Name can't be over 100 digits" }),
      description: z.string({ error: 'Description is required' }),
    })

    const { name, description } = bodySchema.parse(request.body)

    await prisma.team.create({ data: { name, description } })

    return response.status(201).json()
  }
}
