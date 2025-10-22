import type { Request, Response } from 'express'
import { z } from 'zod'
import { hash } from 'bcrypt'

import { prisma } from '@/database/prisma.js'
import { UserRole } from '@prisma/client'
import { AppError } from '@/utils/AppError.js'

class UserController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string({ message: 'Nome é obrigatório' }).trim(),
      email: z
        .string({ message: 'E-mail é obrigatório' })
        .trim()
        .email({ message: 'E-mail inválido' })
        .toLowerCase(),
      password: z
        .string({ message: 'Senha é obrigatória' })
        .trim()
        .min(8, { message: 'A senha deve possuir pelo menos 8 digitos' }),
      role: z
        .enum([UserRole.employee, UserRole.manager], {
          message: "Papel deve ser de 'employee' ou 'manager'",
        })
        .default(UserRole.employee),
    })

    const { name, email, password, role } = bodySchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

    if (userWithSameEmail) {
      throw new AppError('Já existe um usuário cadastrado com esse email')
    }

    const hashedPassword = await hash(password, 8)

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    })

    return response.status(201).json()
  }
}

export { UserController }
