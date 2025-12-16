import { Request, Response } from 'express'
import z from 'zod'
import { hash } from 'bcrypt'

import { Role } from '@prisma/client'
import { AppError } from '../utils/app-error'
import { prisma } from '../database/prisma'
import { DiskStorage } from '../providers/disk-storage'

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
    })

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    const requests = await prisma.request.findMany({
      where: {
        requestedBy: user.role === 'client' ? id : undefined,
        assignedTo: user.role === 'technician' ? id : undefined,
      },
      include: {
        technician: user.role === 'client' && {
          omit: { password: true },
        },
        client: user.role === 'technician' && {
          omit: { password: true },
        },
      },
    })

    return response.json(requests)
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
        confirmPassword: z.string({ error: 'Informe a confirmação da senha' }),
        role: z
          .enum(Object.values(Role), {
            error: `O papel do usuário deve ser um dos seguintes: ${Object.keys(
              Role
            ).join(', ')}`,
          })
          .default('client'),
        availableHours: z
          .array(
            z
              .int({ error: 'Horário deve ser um número' })
              .min(7, { error: 'Horário deve ser maio que 0' })
              .max(23, { error: 'Horário deve ser menor que 23' })
          )
          .default([]),
      })
      .refine(
        ({ password, confirmPassword }) => {
          return password === confirmPassword
        },
        { error: 'A senha e a confirmação não são iguais' }
      )

    const { name, email, password, role, availableHours } = bodySchema.parse(
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
      if (availableHours.length < 1) {
        throw new AppError('Informe os horários disponíveis do técnico')
      }

      if (availableHours.length > 8) {
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
        data: { userId: user.id, availableHours: availableHours },
      })
    }

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json({ ...userWithoutPassword })
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
        'Você não tem permissão para atualizar dados desse usuário',
        401
      )
    }

    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new AppError('Usuário a ser atualizado não encontrado')
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
        confirmPassword: z
          .string({ error: 'Informe a confirmação da senha' })
          .optional(),
        availableHours: z
          .array(
            z
              .int({ error: 'Horário deve ser um número' })
              .min(7, { error: 'Horário deve ser maio que 0' })
              .max(23, { error: 'Horário deve ser menor que 23' })
          )
          .default([]),
      })
      .refine(
        ({ password, confirmPassword }) => {
          return password === confirmPassword
        },
        { error: 'A senha e a confirmação não são iguais' }
      )

    const { name, email, password, availableHours } = bodySchema.parse(
      request.body
    )

    if (!name && !email && !password && availableHours.length === 0) {
      throw new AppError(
        `Informe algum dado a ser atualizado (${Object.values(
          bodySchema.keyof().enum
        ).join(', ')})`
      )
    }

    if (user.role === 'technician' && availableHours.length > 0) {
      await prisma.openingHour.update({
        where: { userId: id },
        data: { availableHours: availableHours },
      })
    }

    if (email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new AppError('Já existe um usuário com esse e-mail')
      }
    }

    const hashedPassword = password ? await hash(password, 10) : undefined

    await prisma.user.update({
      where: { id },
      data: { name, email, password: hashedPassword },
    })

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
      where: {
        requestedBy: user.role === 'client' ? id : undefined,
        assignedTo: user.role === 'technician' ? id : undefined,
      },
    })

    if (userRequests.length > 0) {
      if (user.role === 'client') {
        for (const userRequest of userRequests) {
          await prisma.requestService.deleteMany({
            where: { requestId: userRequest.id },
          })

          await prisma.request.delete({ where: { id: userRequest.id } })
        }
      }

      if (user.role === 'technician') {
        for (const userRequest of userRequests) {
          const technicians = await prisma.user.findMany({
            where: {
              id: { not: user.id },
              role: 'technician',
            },
            orderBy: {
              technicianRequest: { _count: 'asc' },
            },
          })

          if (technicians.length === 0) {
            throw new AppError(
              'Não será possível excluir esse técnico pois não há outros técnicos para receberem os chamados dele'
            )
          }

          const newTechnician = technicians[0]

          await prisma.request.update({
            where: { id: userRequest.id },
            data: { assignedTo: newTechnician.id },
          })
        }

        await prisma.openingHour.delete({ where: { userId: user.id } })
      }
    }

    if (user.profilePicture) {
      const diskStorage = new DiskStorage()

      diskStorage.deleteFile(user.profilePicture, 'uploads')
    }

    await prisma.user.delete({ where: { id } })

    return response.json()
  }
}
