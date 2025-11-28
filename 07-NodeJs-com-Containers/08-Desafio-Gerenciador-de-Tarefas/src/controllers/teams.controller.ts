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

    const paramsSchema = z.object({
      id: z.uuid(),
    })

    if (Object.keys(request.params).length > 0) {
      const { id } = paramsSchema.parse(request.params)

      const teams = await prisma.team.findMany({
        where: { id },
        include: {
          member: {
            omit: { id: true, createdAt: true, teamId: true, userId: true },
            include: { user: { omit: { password: true } } },
          },
        },
      })

      return response.json(teams)
    }

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

    const team = await prisma.team.findUnique({ where: { name } })

    if (team) {
      throw new AppError('A team with this name already exists')
    }

    await prisma.team.create({ data: { name, description } })

    return response.status(201).json()
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Inform a valid ID' }),
    })

    const bodySchema = z.object({
      name: z
        .string({ error: 'Name is required' })
        .max(100, { error: "Name can't be over 100 digits" })
        .optional(),
      description: z.string({ error: 'Description is required' }).optional(),
    })

    const { id } = paramsSchema.parse(request.params)

    const team = await prisma.team.findUnique({ where: { id } })

    if (!team) {
      throw new AppError("The team informed doesn't exist")
    }

    const { name, description } = bodySchema.parse(request.body)

    if (!name && !description) {
      throw new AppError(
        'Inform the data to be updated (name and/or description)'
      )
    }

    await prisma.team.update({ where: { id }, data: { name, description } })

    return response.status(200).json()
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Inform a valid ID' }),
    })

    const { id } = paramsSchema.parse(request.params)

    const team = await prisma.team.findUnique({ where: { id } })

    if (!team) {
      throw new AppError("The team ID informed doesn't exist")
    }

    await prisma.team.delete({ where: { id } })

    return response.json()
  }
}
