import { Request, Response } from 'express'
import z from 'zod'

import { prisma } from '../database/prisma'
import { AppError } from '../utils/app-error'

export class RequestsController {
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
      where: { id: assignedTo },
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

    const userRequest = await prisma.request.create({
      data: { requestedBy: request.user.id, assignedTo },
    })

    const requestService = await prisma.requestService.create({
      data: { requestId: userRequest.id, serviceId },
    })

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      omit: { password: true, profilePicture: true },
    })

    return response.status(201).json({
      request: {
        ...userRequest,
        assignedTo: technician,
        requestedBy: user,
        service,
      },
    })
  }
}
