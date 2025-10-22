import { Request, Response } from 'express'
import { z } from 'zod'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '@/database/prisma.js'
import { authConfig } from '@/configs/auth.js'
import { AppError } from '@/utils/AppError.js'

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z
        .string({ message: 'E-mail é obrigatório' })
        .trim()
        .email({ message: 'E-mail inválido' }),
      password: z
        .string({ message: 'Senha é obrigatória' })
        .trim()
        .min(8, { message: 'A senha deve possuir pelo menos 8 digitos' }),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      throw new AppError('E-mail ou senha inválidos', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('E-mail ou senha inválidos', 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = jwt.sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    })

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json({ user: userWithoutPassword, token })
  }
}

export { SessionsController }
