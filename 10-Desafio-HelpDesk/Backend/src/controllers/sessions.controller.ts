import { Request, Response } from 'express'
import z from 'zod'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '../database/prisma'
import { AppError } from '../utils/app-error'
import { authConfig } from '../configs/auth'

export class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email({ error: 'Informe um e-mail válido' }).trim(),
      password: z.string({ error: 'Informe a senha' }).trim(),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new AppError('E-mail ou senha errados')
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('E-mail ou senha errados')
    }

    const token = jwt.sign(
      {
        role: user.role,
      },
      authConfig.secret,
      {
        subject: user.id,
        expiresIn: authConfig.expiresIn,
      }
    )

    const { password: _, ...userWithoutPassword } = user

    response.status(201).json({
      user: userWithoutPassword,
      token,
    })
  }
}
