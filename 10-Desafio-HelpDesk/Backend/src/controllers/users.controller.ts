import { Request, Response } from 'express'
import z from 'zod'
import { hash } from 'bcrypt'

import { Role } from '@prisma/client'
import { AppError } from '../utils/app-error'
import { prisma } from '../database/prisma'

export class UsersController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      role: z
        .enum(Object.values(Role), {
          error: `O papel do usuário deve ser um dos seguintes: ${Object.keys(
            Role
          ).join(', ')}`,
        })
        .default('technician'),
    })

    const { role } = querySchema.parse(request.query)

    const users = await prisma.user.findMany({
      where: { role },
      omit: { password: true },
    })

    return response.json(users)
  }

  async create(request: Request, response: Response) {
    const bodySchema = z
      .object({
        name: z
          .string({ error: 'Informe o nome' })
          .trim()
          .min(3, { error: 'Informe o nome' }),
        email: z.email({ error: 'Informe um e-mail válido' }).trim(),
        password: z
          .string({ error: 'Informe a senha' })
          .trim()
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
            error:
              'Senha inválida.\nUma senha deve conter 8 digitos e incluir uma letra maíuscula e minúscula, um número e um caractere especial',
          }),
        confirm_password: z.string({ error: 'Informe a confirmação da senha' }),
        role: z
          .enum(Object.values(Role), {
            error: `O papel do usuário deve ser um dos seguintes: ${Object.keys(
              Role
            ).join(', ')}`,
          })
          .default('client'),
        available_hours: z
          .array(
            z
              .int({ error: 'Horário deve ser um número' })
              .min(0, { error: 'Horário deve ser maio que 0' })
              .max(23, { error: 'Horário deve ser menor que 23' })
          )
          .default([]),
      })
      .refine(
        ({ password, confirm_password }) => {
          return password === confirm_password
        },
        { error: 'A senha e a confirmação não são iguais' }
      )

    const { name, email, password, role, available_hours } = bodySchema.parse(
      request.body
    )

    if (role !== 'client' && (!request.user || request.user.role !== 'admin')) {
      throw new AppError(
        'Somente administradores do sistema podem criar usuários com esse papel'
      )
    }

    const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

    if (userWithSameEmail) {
      throw new AppError('Já existe um usuário com esse e-mail')
    }

    if (role === 'technician' && available_hours.length !== 8) {
      throw new AppError('Um técnico precisa ter uma jornada de 8 horas')
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    })

    if (role === 'technician') {
      await prisma.openingHour.create({
        data: { userId: user.id, availableHours: available_hours },
      })
    }

    return response.status(201).json()
  }
}
