import { Request, Response } from 'express'
import z from 'zod'
import { hash } from 'bcrypt'

import { UserRole } from '../database/generate/client'
import { prisma } from '../database/prisma'
import { AppError } from '../utils/app-error'

export class UsersController {
  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany({ omit: { password: true } })

    return response.json(users)
  }

  async create(request: Request, response: Response) {
    const bodySchema = z
      .object({
        name: z
          .string({ error: 'Name is required' })
          .max(100, { error: "Name can't be over 100 digits" }),
        email: z
          .email({ error: 'E-mail is required and must be valid' })
          .max(150, { error: "E-mail can't be over 150 digits" }),
        password: z
          .string({ error: 'Password is required' })
          .min(8, { error: 'Password must contain at least 8 characters' }),
        confirm_password: z.string({ error: 'Password is required' }),
        role: z
          .enum(Object.values(UserRole), {
            error: `Role must be only "${Object.values(UserRole).join(
              '", "'
            )}"`,
          })
          .default(UserRole.member),
      })
      .refine((data) => data.password === data.confirm_password, {
        error: "Passwords don't match",
      })

    const { name, email, password, role } = bodySchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

    if (userWithSameEmail) {
      throw new AppError('This e-mail is already beeing used')
    }

    const hashedPassword = await hash(password, 8)

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    })

    return response.status(201).json()
  }
}
