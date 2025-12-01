import { Request, Response } from 'express'
import z from 'zod'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '../database/prisma'
import { authConfig } from '../configs/auth'
import { AppError } from '../utils/app-error'

export class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email({ error: 'E-mail is required and must be valid' }),
      password: z
        .string({ error: 'Password is required' })
        .min(8, { error: 'Password must contain at least 8 characters' }),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new AppError('Wrong E-mail or Password', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Wrong E-mail or Password', 401)
    }

    const { secret } = authConfig.jwt

    const token = jwt.sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn: '3d',
    })

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json({ user: userWithoutPassword, token })
  }
}
