import { Request, Response } from 'express'
import z from 'zod'

import { prisma } from '../database/prisma'
import { AppError } from '../utils/app-error'
import { Status } from '@prisma/client'

export class RequestsController {
  async index(request: Request, response: Response) {
    const requests = await prisma.request.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        services: {
          select: {
            service: {
              select: {
                id: true,
                type: true,
                value: true,
                isActive: true,
              },
            },
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        requestedBy: true,
        assignedTo: true,
      },
    })

    return response.json(requests)
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number({ error: 'Informe um chamado existente' }),
    })

    const { id } = paramsSchema.parse(request.params)

    const userRequest = await prisma.request.findUnique({
      where: { id },
      omit: { requestedBy: true, assignedTo: true },
      include: {
        services: {
          select: {
            service: {
              select: {
                id: true,
                type: true,
                value: true,
                isActive: true,
              },
            },
          },
        },
        client: request.user?.role !== 'client' && {
          select: {
            id: true,
            name: true,
          },
        },
        technician: request.user?.role !== 'technician' && {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const isUserAuthorized = await prisma.request.findUnique({
      where: { id },
      select: { requestedBy: true, assignedTo: true },
    })

    if (!userRequest || !isUserAuthorized) {
      throw new AppError('Chamado não encontrado')
    }

    if (
      !request.user ||
      (request.user.role !== 'admin' &&
        isUserAuthorized.assignedTo !== request.user.id &&
        isUserAuthorized.requestedBy !== request.user.id)
    ) {
      throw new AppError(
        'Você não tem permissão para visualizar esse chamado',
        401
      )
    }

    return response.json({ ...userRequest })
  }

  async create(request: Request, response: Response) {
    if (!request.user) {
      throw new AppError('Usuário não encontrado')
    }

    const bodySchema = z.object({
      serviceId: z.uuid({ error: 'Informe um serviço válido' }),
      assignedTo: z.uuid({ error: 'Informe um técnico válido' }),
    })

    const { serviceId, assignedTo } = bodySchema.parse(request.body)

    const technician = await prisma.user.findUnique({
      where: { id: assignedTo, role: 'technician' },
      omit: { password: true, profilePicture: true },
    })

    if (!technician) {
      throw new AppError('Técnico não encontrado')
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      throw new AppError('Serviço não encontrado')
    }

    if (!service.isActive) {
      throw new AppError('Esse serviço não está mais ativo para atendimento')
    }

    const userRequest = await prisma.request.create({
      data: { requestedBy: request.user.id, assignedTo },
    })

    await prisma.requestService.create({
      data: { requestId: userRequest.id, serviceId },
    })

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      omit: { password: true, profilePicture: true },
    })

    return response.status(201).json({
      ...userRequest,
      assignedTo: technician,
      requestedBy: user,
      service,
    })
  }

  async createRequestService(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number({ error: 'Informe um chamado existente' }).min(1),
    })

    const { id } = paramsSchema.parse(request.params)

    const clientRequest = await prisma.request.findUnique({ where: { id } })

    if (!clientRequest) {
      throw new AppError('Chamado não encontrado')
    }

    if (!request.user || clientRequest.assignedTo !== request.user.id) {
      throw new AppError(
        'Você não é o técnico responsável por esse chamado',
        401
      )
    }

    const bodySchema = z.object({
      serviceId: z.uuid({ error: 'Informe um serviço válido' }),
    })

    const { serviceId } = bodySchema.parse(request.body)

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      throw new AppError('O serviço informado não existe')
    }

    if (!service.isActive) {
      throw new AppError(
        'Esse serviço não pode ser adicionado pois está desativado'
      )
    }

    const requestServiceAlreadyExists = await prisma.requestService.findFirst({
      where: { requestId: id, serviceId },
    })

    if (requestServiceAlreadyExists) {
      throw new AppError(
        'Esse serviço não pode ser adicionado porque ele já faz parte do chamado'
      )
    }

    await prisma.requestService.create({ data: { requestId: id, serviceId } })

    const userRequest = await prisma.request.findUnique({
      where: { id },
      omit: { requestedBy: true, assignedTo: true },
      include: {
        services: {
          select: {
            service: {
              select: {
                id: true,
                type: true,
                value: true,
                isActive: true,
              },
            },
          },
        },
        client: request.user?.role !== 'client' && {
          select: {
            id: true,
            name: true,
          },
        },
        technician: request.user?.role !== 'technician' && {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return response.status(201).json({ ...userRequest })
  }

  async patch(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number({ error: 'Informe um chamado existente' }).min(1),
    })

    const { id } = paramsSchema.parse(request.params)

    const clientRequest = await prisma.request.findUnique({ where: { id } })

    if (!clientRequest) {
      throw new AppError('Chamado não encontrado')
    }

    if (!request.user || clientRequest.assignedTo !== request.user.id) {
      throw new AppError(
        'Você não é o técnico responsável por esse chamado',
        401
      )
    }

    const bodySchema = z.object({
      status: z.enum(Object.values(Status), {
        error: `O status do chamado deve ser um dos seguintes: ${Object.keys(
          Status
        ).join(', ')}`,
      }),
    })

    const { status } = bodySchema.parse(request.body)

    if (clientRequest.status === status) {
      throw new AppError(`O status desse chamado já é "${status}"`)
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status },
    })

    return response.json({ ...updatedRequest })
  }
}
