import { Request, Response } from 'express'
import z from 'zod'

import { Status } from '../database/generate/client'
import { Priority } from '../database/generate/client'
import { prisma } from '../database/prisma'
import { AppError } from '../../utils/app-error'

export class TasksController {
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
}
