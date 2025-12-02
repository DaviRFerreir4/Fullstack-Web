import { Request, Response } from 'express'
import z from 'zod'

import { Status } from '@prisma/client'
import { Priority } from '@prisma/client'
import { prisma } from '../database/prisma'
import { AppError } from '../utils/app-error'

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

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Inform a valid ID' }),
    })

    const { id } = paramsSchema.parse(request.params)

    const taskWithHistories = await prisma.task.findUnique({
      where: { id },
      include: { taskHistories: true },
    })

    return response.json(taskWithHistories)
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
      assign_to: z
        .uuid({
          error: 'Inform a valid ID',
        })
        .optional(),
      team_id: z.uuid({ error: 'Inform a valid ID' }).optional(),
      priority: z
        .enum(Object.values(Priority), {
          error: `Priority must be only "${Object.values(Priority).join(
            '", "'
          )}"`,
        })
        .optional(),
    })

    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findUnique({ where: { id } })

    if (!task) {
      throw new AppError("The task informed doesn't exist")
    }

    const { title, description, assign_to, team_id, priority } =
      bodySchema.parse(request.body)

    if (!title && !description && !assign_to && !team_id && !priority) {
      throw new AppError(
        `Inform at least one data to be updated ("${Object.values(
          bodySchema.keyof().enum
        ).join('", "')}")`
      )
    }

    let user

    if (assign_to) {
      user = await prisma.user.findUnique({ where: { id: assign_to } })

      if (!user) {
        throw new AppError("The user informed doesn't exist")
      }
    }

    let team

    if (team_id) {
      team = await prisma.team.findUnique({ where: { id: team_id } })

      if (!team) {
        throw new AppError("The team informed doesn't exist")
      }
    }

    if (user && team) {
      const teamMemberRegistred = await prisma.teamsMembers.findFirst({
        where: { userId: assign_to, teamId: team_id },
      })

      if (!teamMemberRegistred) {
        throw new AppError("This user doesn't belong to this team")
      }
    }

    if (user && !team_id) {
      const teamMemberRegistred = await prisma.teamsMembers.findFirst({
        where: { userId: assign_to, teamId: task.teamId },
      })

      console.log(teamMemberRegistred)

      if (!teamMemberRegistred) {
        throw new AppError(
          "This user doesn't belong to the team assigned to the task"
        )
      }
    }

    if (team && !assign_to) {
      const teamMemberRegistred = await prisma.teamsMembers.findFirst({
        where: { userId: task.assignTo, teamId: team_id },
      })

      console.log(teamMemberRegistred)

      if (!teamMemberRegistred) {
        throw new AppError(
          "The user assigned to this task doesn't belong to this team"
        )
      }
    }

    await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        assignTo: assign_to,
        teamId: team_id,
        priority,
      },
    })

    return response.json()
  }

  async patch(request: Request, response: Response) {
    if (!request.user) {
      throw new AppError('User data not found')
    }

    const paramsSchema = z.object({
      id: z.uuid({ error: 'Inform a valid ID' }),
    })

    const bodySchema = z.object({
      status: z.enum(Object.values(Status), {
        error: `Expected status. Status must be only "${Object.values(
          Status
        ).join('", "')}"`,
      }),
    })

    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findUnique({ where: { id } })

    if (!task) {
      throw new AppError("The task informed doesn't exist")
    }

    if (request.user.role === 'member' && task.assignTo !== request.user.id) {
      throw new AppError(
        "You can't change the status from this task because it wasn't assigned to you"
      )
    }

    const { status } = bodySchema.parse(request.body)

    if (task.status === status) {
      throw new AppError('This task already has the status informed')
    }

    if (task.status === 'in_progress' && status === 'pending') {
      throw new AppError(
        `This task has the status of "${task.status}", so you can't change its status to "${status}"`
      )
    }

    await prisma.task.update({ where: { id }, data: { status } })

    await prisma.tasksHistory.create({
      data: {
        taskId: task.id,
        changedBy: request.user.id,
        oldStatus: task.status,
        newStatus: status,
      },
    })

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
