import { Request, Response } from 'express'
import z from 'zod'

import { prisma } from '../database/prisma'
import { AppError } from '../../utils/app-error'

export class TeamsMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_email: z
        .email({ error: 'E-mail is required and must be valid' })
        .max(150, { error: "E-mail can't be over 150 digits" }),
      team_name: z
        .string({ error: 'Name is required' })
        .max(100, { error: "Name can't be over 100 digits" }),
    })

    const { user_email, team_name } = bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({ where: { email: user_email } })

    const team = await prisma.team.findUnique({ where: { name: team_name } })

    if (!user) {
      throw new AppError("This user doesn't exist")
    }

    if (!team) {
      throw new AppError("This team doen't exist")
    }

    await prisma.teamsMembers.create({
      data: { userId: user.id, teamId: team.id },
    })

    return response.status(201).json({ user: user.name, team: team.name })
  }
}
