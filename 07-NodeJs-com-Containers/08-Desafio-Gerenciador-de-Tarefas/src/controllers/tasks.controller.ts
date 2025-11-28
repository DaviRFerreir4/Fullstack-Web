import { Request, Response } from 'express'
import z from 'zod'

import { Status } from '../database/generate/client'
import { Priority } from '../database/generate/client'
import { prisma } from '../database/prisma'
import { AppError } from '../../utils/app-error'

export class TasksController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      title: z.string().optional(),
      // assign_to: z
      //   .uuid({
      //     error: 'Inform a valid ID',
      //   })
      //   .optional(),
      // team_id: z.uuid({ error: 'Inform a valid ID' }).optional(),
      status: z
        .enum(Object.values(Status), {
          error: `Status must be only "${Object.values(Status).join('", "')}"`,
        })
        .optional(),
      priority: z
        .enum(Object.values(Priority), {
          error: `Priority must be only "${Object.values(Priority).join(
            '", "'
          )}"`,
        })
        .optional(),
    })

    const { title, /* assign_to, team_id, */ status, priority } =
      querySchema.parse(request.query)

    const tasks = await prisma.task.findMany({
      where: {
        title: { contains: title },
        // assignTo: assign_to,
        // teamId: team_id,
        status,
        priority,
      },
    })

    return response.json(tasks)
  }

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z
        .string({ error: 'Title is required' })
        .max(200, { error: "Title can't be over 200 digits" }),
      description: z.string({ error: 'Description is required' }),
      assign_to: z.uuid({
        error: 'You must inform an user assigned to the task',
      }),
      team_id: z.uuid({ error: 'You must inform a team assigned to the task' }),
      status: z
        .enum(Object.values(Status), {
          error: `Status must be only "${Object.values(Status).join('", "')}"`,
        })
        .default('pending'),
      priority: z
        .enum(Object.values(Priority), {
          error: `Priority must be only "${Object.values(Priority).join(
            '", "'
          )}"`,
        })
        .default('low'),
    })

    const { title, description, assign_to, team_id, status, priority } =
      bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({ where: { id: assign_to } })

    if (!user) {
      throw new AppError("This user doesn't exist")
    }

    const team = await prisma.team.findUnique({ where: { id: team_id } })

    if (!team) {
      throw new AppError("This team doesn't exist")
    }

    const teamMemberRegistred = await prisma.teamsMembers.findFirst({
      where: { userId: assign_to, teamId: team_id },
    })

    if (!teamMemberRegistred) {
      throw new AppError("This user doesn't belong to this team")
    }

    await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        assignTo: assign_to,
        teamId: team_id,
      },
    })

    return response.status(201).json()
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Inform a valid ID' }),
    })

    const bodySchema = z.object({
      title: z
        .string()
        .max(200, { error: "Title can't be over 200 digits" })
        .optional(),
      description: z.string().optional(),
    })

    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findUnique({ where: { id } })

    if (!task) {
      throw new AppError("The task informed doesn't exist")
    }

    const { title, description } = bodySchema.parse(request.body)

    if (!title && !description) {
      throw new AppError(
        'Inform the data to be updated (title and/or description)'
      )
    }

    await prisma.task.update({ where: { id }, data: { title, description } })

    return response.json()
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Inform a valid ID' }),
    })

    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findUnique({ where: { id } })

    if (!task) {
      throw new AppError("The task informed doesn't exist")
    }

    await prisma.task.delete({ where: { id } })

    return response.json()
  }
}
