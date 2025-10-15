import { Request, Response } from 'express'
import { prisma } from '@/database/prisma'
import { z } from 'zod'
import { AppError } from '@/utils/app-error'

class DeliveriesStatusController {
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      status: z.enum(['processing', 'shipped', 'delivered']),
    })

    const { id } = paramsSchema.parse(request.params)
    const { status } = bodySchema.parse(request.body)

    const delivery = await prisma.delivery.findUnique({ where: { id } })

    if (!delivery) {
      throw new AppError('delivery not found')
    }

    if (delivery.status === status) {
      throw new AppError(`can't change status to same status in delivery`)
    }

    await prisma.delivery.update({
      data: { status },
      where: { id },
    })

    await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description: `Delivery status updated to ${status}`,
      },
    })

    return response.json()
  }
}

export { DeliveriesStatusController }
