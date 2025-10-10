import type { Request, Response } from 'express'
import { prisma } from '@/prisma.js'

class QuestionsController {
  async index(request: Request, response: Response) {
    const { title, content } = request.query

    const questions = await prisma.question.findMany({
      where: {
        title: {
          contains: title?.toString(),
          mode: 'insensitive',
        },
        content: {
          contains: content?.toString(),
          mode: 'insensitive',
        },
      },
      orderBy: {
        title: 'asc',
      },
    })

    return response.json(questions)
  }

  async create(request: Request, response: Response) {
    const { title, content, user_id } = request.body

    await prisma.question.create({ data: { title, content, userId: user_id } })

    return response.status(201).json()
  }

  async update(request: Request, response: Response) {
    return response.json()
  }

  async remove(request: Request, response: Response) {
    return response.json()
  }
}

export { QuestionsController }
