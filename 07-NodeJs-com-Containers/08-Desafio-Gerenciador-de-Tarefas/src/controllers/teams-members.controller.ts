import { Request, Response } from 'express'
import z from 'zod'

import { prisma } from '../database/prisma'
import { AppError } from '../../utils/app-error'

export class TeamsMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.uuid({ error: 'Inform a valid user ID' }),
      team_id: z.uuid({ error: 'Inform a valid user ID' }),
    })

    const { user_id, team_id } = bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({ where: { id: user_id } })

    const team = await prisma.team.findUnique({ where: { id: team_id } })

    if (!user) {
      throw new AppError("This user doesn't exist")
    }

    if (!team) {
      throw new AppError("This team doen't exist")
    }

    const teamMemberRegister = await prisma.teamsMembers.findFirst({
      where: { userId: user.id, teamId: team.id },
    })

    if (teamMemberRegister) {
      throw new AppError('This user already belong to this team')
    }

    await prisma.teamsMembers.create({
      data: { userId: user.id, teamId: team.id },
    })

    return response.status(201).json({ user: user.name, team: team.name })
  }

  async remove(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.uuid(),
      team_id: z.uuid(),
    })

    const { user_id, team_id } = bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({ where: { id: user_id } })

    const team = await prisma.team.findUnique({ where: { id: team_id } })

    if (!user) {
      throw new AppError("This user doesn't exist")
    }

    if (!team) {
      throw new AppError("This team doen't exist")
    }

    const teamMemberRegister = await prisma.teamsMembers.findFirst({
      where: { userId: user.id, teamId: team.id },
    })

    if (!teamMemberRegister) {
      throw new AppError("This user doesn't belong to this team")
    }

    await prisma.teamsMembers.delete({
      where: { id: teamMemberRegister.id },
    })

    return response.json()
  }
}
