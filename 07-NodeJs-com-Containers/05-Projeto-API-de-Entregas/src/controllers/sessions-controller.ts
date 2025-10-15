import { Request, Response } from 'express'
import { z } from 'zod'
import { AppError } from '@/utils/app-error'
import { prisma } from '@/database/prisma'
import { compare } from 'bcrypt'

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().trim().email(),
      password: z.string().trim().min(6),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Invalid email or password', 401)
    }

    return response.status(201).json({ message: 'ok' })
  }
}

export { SessionsController }
