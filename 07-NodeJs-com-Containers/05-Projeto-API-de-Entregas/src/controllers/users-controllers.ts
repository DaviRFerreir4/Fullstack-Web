import type { Request, Response } from 'express'
import { hash } from 'bcrypt'
import { z } from 'zod'
import { AppError } from '@/utils/app-error'
import { prisma } from '@/database/prisma'

class UserControllers {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim(),
      email: z.string().trim().email(),
      password: z.string().trim().min(6),
      role: z.enum(['customer', 'sale']).optional(),
    })

    const { name, email, password, role } = bodySchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

    if (userWithSameEmail) {
      throw new AppError('user with same email already exists')
    }

    const hashedPassword = await hash(password, 8)

    const { password: _, ...userWithoutPassword } = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    })

    return response.status(201).json(userWithoutPassword)
  }
}

export { UserControllers }
