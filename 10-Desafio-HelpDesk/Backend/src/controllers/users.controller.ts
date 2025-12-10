import { Request, Response } from 'express'
import z from 'zod'
import { hash } from 'bcrypt'

import { Role } from '@prisma/client'
import { AppError } from '../utils/app-error'
import { prisma } from '../database/prisma'

export class UsersController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional(),
      role: z
        .enum(Object.values(Role), {
          error: `O papel do usuário deve ser um dos seguintes: ${Object.keys(
            Role
          ).join(', ')}`,
        })
        .optional(),
      page: z.coerce.number().default(1),
      perPage: z.coerce.number().default(10),
    })

    const { role, name, page, perPage } = querySchema.parse(request.query)

    const skip = (page - 1) * perPage

    const users = await prisma.user.findMany({
      skip,
      where: { role, name: { contains: name, mode: 'insensitive' } },
      omit: { password: true },
    })

    const totalRecords = await prisma.user.count({
      where: { role },
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    return response.json({
      users,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    })
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Informe um usuário válido' }),
    })

    const { id } = paramsSchema.parse(request.params)

    if (
      !request.user ||
      (request.user.id !== id && request.user.role !== 'admin')
    ) {
      throw new AppError(
        'Você não tem permissão para ver os dados desse usuário',
        401
      )
    }

    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    })

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    return response.json(user)
  }

  async showRequests(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Informe um usuário válido' }),
    })

    const { id } = paramsSchema.parse(request.params)

    if (
      !request.user ||
      (request.user.role !== 'admin' && id !== request.user.id)
    ) {
      throw new AppError(
        'Você não tem permissão para visualizar os chamados desse usuário',
        401
      )
    }

    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
      include: {
        clientRequest: request.user.role === 'client' && {
          omit: {
            requestedBy: true,
          },
          include: {
            technician: {
              omit: {
                password: true,
              },
            },
          },
        },
        technicianRequest: request.user.role === 'technician' && {
          omit: {
            assignedTo: true,
          },
          include: {
            client: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    return response.json(user)
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
              .min(7, { error: 'Horário deve ser maio que 0' })
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

    if (role === 'technician') {
      if (available_hours.length < 1) {
        throw new AppError('Informe os horários disponíveis do técnico')
      }

      if (available_hours.length > 8) {
        throw new AppError(
          'Um técnico não pode trabalhar mais que 8 horas no dia'
        )
      }
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

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json({ user: userWithoutPassword })
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Informe um usuário válido' }),
    })

    const { id } = paramsSchema.parse(request.params)

    if (
      !request.user ||
      (request.user.role !== 'admin' && id !== request.user.id)
    ) {
      throw new AppError(
        'Você não tem permissão para excluir esse usuário',
        401
      )
    }

    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new AppError('Usuário a ser removido não encontrado')
    }

    const bodySchema = z
      .object({
        name: z
          .string({ error: 'Informe o nome' })
          .trim()
          .min(3, { error: 'Informe o nome' })
          .optional(),
        email: z.email({ error: 'Informe um e-mail válido' }).trim().optional(),
        password: z
          .string({ error: 'Informe a senha' })
          .trim()
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
            error:
              'Senha inválida.\nUma senha deve conter 8 digitos e incluir uma letra maíuscula e minúscula, um número e um caractere especial',
          })
          .optional(),
        confirm_password: z
          .string({ error: 'Informe a confirmação da senha' })
          .optional(),
        available_hours: z
          .array(
            z
              .int({ error: 'Horário deve ser um número' })
              .min(7, { error: 'Horário deve ser maio que 0' })
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

    const { name, email, password, available_hours } = bodySchema.parse(
      request.body
    )

    if (!name && !email && !password && available_hours.length === 0) {
      throw new AppError(
        `Informe algum dado a ser atualizado (${Object.values(
          bodySchema.keyof().enum
        ).join(', ')})`
      )
    }

    if (user.role === 'technician' && available_hours.length > 0) {
      await prisma.openingHour.update({
        where: { userId: id },
        data: { availableHours: available_hours },
      })
    }

    await prisma.user.update({ where: { id }, data: { name, email, password } })

    return response.json()
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Informe um usuário válido' }),
    })

    const { id } = paramsSchema.parse(request.params)

    if (
      !request.user ||
      (request.user.role !== 'admin' && id !== request.user.id)
    ) {
      throw new AppError(
        'Você não tem permissão para excluir esse usuário',
        401
      )
    }

    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new AppError('Usuário a ser removido não encontrado')
    }

    const userRequests = await prisma.request.findMany({
      where: { requestedBy: id },
    })

    if (userRequests.length > 0) {
      userRequests.forEach(async (userRequest) => {
        await prisma.requestService.deleteMany({
          where: { requestId: userRequest.id },
        })
        await prisma.request.delete({ where: { id: userRequest.id } })
      })
    }

    await prisma.user.delete({ where: { id } })

    return response.json()
  }
}
